#!/bin/sh

if [ -f "/etc/nginx/certificates/app.key" ] && [ -f "/etc/nginx/certificates/app.crt" ]; then
    echo "Using provided certificates"
else
    mkdir /etc/nginx/certificates
    chmod 700 /etc/nginx/certificates
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/certificates/app.key -out /etc/nginx/certificates/app.crt -subj "/C=FR/ST=France/L=Paris/O=ETNA"
    openssl dhparam -out /etc/nginx/certificates/dhparam.pem 2048
fi

nginx -g "daemon off;"
