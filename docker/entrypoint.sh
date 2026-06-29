#!/bin/sh
set -eu

PORT="${PORT:-8080}"
export PORT

echo "→ CEMAPROF container starting on port ${PORT}"

# Build DATABASE_URL from Railway PG* references when the full URL ref is missing
if [ -z "${DATABASE_URL:-}" ] && [ -n "${PGHOST:-}" ] && [ -n "${PGUSER:-}" ] && [ -n "${PGDATABASE:-}" ]; then
    DATABASE_URL="$(php -r '
        $host = getenv("PGHOST");
        $port = getenv("PGPORT") ?: "5432";
        $user = getenv("PGUSER");
        $pass = getenv("PGPASSWORD") ?: "";
        $db = getenv("PGDATABASE");
        $query = getenv("PGSSLMODE") ? "?sslmode=" . rawurlencode(getenv("PGSSLMODE")) : "";
        echo "postgresql://" . rawurlencode($user) . ":" . rawurlencode($pass) . "@{$host}:{$port}/" . rawurlencode($db) . $query;
    ')"
    export DATABASE_URL
    echo "→ DATABASE_URL built from PGHOST/PGUSER/PGDATABASE"
fi

# Diagnostic (no secrets)
echo "→ DB check: DATABASE_URL=$([ -n "${DATABASE_URL:-}" ] && echo set || echo missing) PGHOST=${PGHOST:-missing} PGDATABASE=${PGDATABASE:-missing}"

db_configured() {
    [ -n "${DATABASE_URL:-}" ] \
        || [ -n "${DB_URL:-}" ] \
        || [ -n "${DB_HOST:-}" ] \
        || [ -n "${PGHOST:-}" ]
}

sync_db_env() {
    export DB_CONNECTION="${DB_CONNECTION:-pgsql}"

    if [ -n "${DATABASE_URL:-}" ]; then
        export DB_URL="${DB_URL:-$DATABASE_URL}"
        db_host="$(php -r 'echo parse_url(getenv("DATABASE_URL"), PHP_URL_HOST) ?: "";' 2>/dev/null || true)"
        echo "→ DATABASE_URL ready (host: ${db_host:-?})"
        return 0
    fi

    if [ -n "${DB_URL:-}" ]; then
        echo "→ DB_URL detected"
        return 0
    fi

    if [ -n "${PGHOST:-}" ]; then
        export DB_HOST="${DB_HOST:-$PGHOST}"
        export DB_PORT="${DB_PORT:-${PGPORT:-5432}}"
        export DB_DATABASE="${DB_DATABASE:-${PGDATABASE:-}}"
        export DB_USERNAME="${DB_USERNAME:-${PGUSER:-}}"
        export DB_PASSWORD="${DB_PASSWORD:-${PGPASSWORD:-}}"
        echo "→ PostgreSQL vars ready (host: ${DB_HOST})"
        return 0
    fi

    if [ -n "${DB_HOST:-}" ]; then
        echo "→ DB_HOST detected (${DB_HOST})"
        return 0
    fi

    return 1
}

# Render Nginx config from template (Railway injects $PORT)
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Writable dirs (Railway volume may be mounted on storage/)
mkdir -p \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    storage/app/public \
    bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache

# Public storage symlink for uploaded images
php artisan storage:link --force 2>/dev/null || true

# Wait for PostgreSQL then migrate
if db_configured && sync_db_env; then
    echo "→ Waiting for database…"
    attempt=0
    max_attempts=30

    until php artisan migrate --force --no-interaction; do
        attempt=$((attempt + 1))
        if [ "$attempt" -ge "$max_attempts" ]; then
            echo "✗ Database not reachable after ${max_attempts} attempts"
            exit 1
        fi
        sleep 2
    done

    echo "→ Migrations complete"

    php artisan cache:clear --no-interaction 2>/dev/null || true
    echo "→ Application cache cleared"

    if [ "${RUN_SEEDER:-false}" = "true" ]; then
        echo "→ Running seeders…"
        php artisan db:seed --force --no-interaction
    fi
else
    echo "⚠ No database configured — skipping migrations"
    echo "  1. Railway canvas → click PostgreSQL → note its exact name (e.g. Postgres)"
    echo "  2. Web service → Variables → New Variable → Reference"
    echo "  3. Pick Postgres service → DATABASE_URL (or PGHOST + PGUSER + PGDATABASE + PGPASSWORD + PGPORT)"
    echo "  4. Redeploy. Logs must show: DATABASE_URL=set"
fi

php artisan config:clear --no-interaction 2>/dev/null || true

if [ "${APP_ENV:-production}" = "production" ]; then
    if db_configured; then
        sync_db_env
        php artisan config:cache --no-interaction
        php artisan route:cache --no-interaction
        php artisan view:cache --no-interaction
    else
        echo "⚠ Skipping config:cache — no database env vars (would bake 127.0.0.1 defaults)"
    fi
fi

echo "→ Starting Nginx + PHP-FPM"
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
