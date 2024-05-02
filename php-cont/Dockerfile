FROM php:8.3.6-apache
RUN curl -sSL https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions -o - | sh -s pdo_mysql
COPY source.tar.gz /tmp/
RUN cd /tmp; tar xzf source.tar.gz; cp -r Project-PHP/* /var/www/html/
