#!/bin/sh
set -eu

PORT="${PORT:-8080}"
export PORT

echo "→ CEMAPROF container starting on port ${PORT}"

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
if [ -n "${DATABASE_URL:-}" ] || [ -n "${DB_URL:-}" ] || [ -n "${DB_HOST:-}" ] || [ -n "${PGHOST:-}" ]; then
    export DB_CONNECTION="${DB_CONNECTION:-pgsql}"

    if [ -n "${DATABASE_URL:-}" ] && [ -z "${DB_URL:-}" ]; then
        export DB_URL="${DATABASE_URL}"
    fi

    if [ -n "${PGHOST:-}" ] && [ -z "${DB_HOST:-}" ]; then
        export DB_HOST="${PGHOST}"
        export DB_PORT="${DB_PORT:-${PGPORT:-5432}}"
        export DB_DATABASE="${DB_DATABASE:-${PGDATABASE}}"
        export DB_USERNAME="${DB_USERNAME:-${PGUSER}}"
        export DB_PASSWORD="${DB_PASSWORD:-${PGPASSWORD}}"
    fi

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

    if [ "${RUN_SEEDER:-false}" = "true" ]; then
        echo "→ Running seeders…"
        php artisan db:seed --force --no-interaction
    fi
else
    echo "⚠ No database configured — skipping migrations"
fi

if [ "${APP_ENV:-production}" = "production" ]; then
    php artisan config:cache --no-interaction
    php artisan route:cache --no-interaction
    php artisan view:cache --no-interaction
fi

echo "→ Starting Nginx + PHP-FPM"
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
