FROM php:8.4-fpm

# install-php-extensions: robust helper for adding PHP extensions
COPY --from=mlocati/php-extension-installer:2 /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions \
    pdo_mysql \
    intl \
    zip \
    opcache \
    bcmath

# Composer (pulled from the official image)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Run the container as the host user so files written into the bind mount
# (cache, migrations, generated entities) are owned by you, not root.
ARG UID=1000
ARG GID=1000
RUN groupmod -g "${GID}" www-data 2>/dev/null || true \
 && usermod -u "${UID}" -g "${GID}" www-data 2>/dev/null || true

WORKDIR /var/www/html
USER www-data

EXPOSE 9000
CMD ["php-fpm"]
