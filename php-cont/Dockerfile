FROM php:8.3.6-apache
COPY source.tar.gz /tmp/
RUN cd /tmp; tar xzf source.tar.gz; cp -r Project-PHP/* /var/www/html/
RUN echo "extension=pdo_mysql" > /usr/local/etc/php/conf.d/mah.ini
