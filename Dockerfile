# ── Stage 1: build frontend assets (Vite + React) ───────────────────────────
FROM node:22-bookworm-slim AS frontend

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY vite.config.js postcss.config.js tailwind.config.js ./
COPY resources ./resources
COPY public ./public

ARG VITE_APP_NAME=CEMAPROF
ENV VITE_APP_NAME=${VITE_APP_NAME}

RUN npm run build


# ── Stage 2: PHP dependencies (must match runtime PHP 8.4) ───────────────────
FROM php:8.4-cli-bookworm AS vendor

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --prefer-dist \
    --optimize-autoloader

COPY . .
RUN composer dump-autoload --optimize --no-dev


# ── Stage 3: production image (Nginx + PHP-FPM) ───────────────────────────────
FROM php:8.4-fpm-bookworm

LABEL maintainer="CEMAPROF"

RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    gettext-base \
    curl \
    libpq-dev \
    libzip-dev \
    unzip \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        opcache \
        pdo_pgsql \
        zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/99-opcache.ini
COPY docker/php/uploads.ini /usr/local/etc/php/conf.d/99-uploads.ini
COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /var/www/html

COPY --from=vendor /app/vendor ./vendor
COPY --from=frontend /app/public/build ./public/build
COPY . .

RUN mkdir -p \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwx storage bootstrap/cache

ENV PORT=8080 \
    APP_ENV=production \
    APP_DEBUG=false

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -fsS "http://127.0.0.1:${PORT}/up" || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
