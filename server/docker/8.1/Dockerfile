FROM avidian/php-8.1

ARG WWWGROUP

WORKDIR /var/www/html

ENV DEBIAN_FRONTEND noninteractive

RUN groupadd --force -g $WWWGROUP sail
RUN useradd -ms /bin/bash --no-user-group -g $WWWGROUP -u 1337 sail

COPY start-container /usr/local/bin/start-container
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY php.ini /etc/php/8.1/cli/conf.d/99-sail.ini
RUN chmod +x /usr/local/bin/start-container

RUN mkdir -p /home/sail/.vscode-server/extensions \
    /home/sail/.vscode-server-insiders/extensions \
    && chown -R sail \
    /home/sail/.vscode-server \
    /home/sail/.vscode-server-insiders

EXPOSE 8000

ENTRYPOINT ["start-container"]
