FROM nginx:1.19-alpine

RUN apk update && apk add curl

RUN rm /etc/nginx/conf.d/default.conf
COPY ./proxy.conf /etc/nginx/conf.d/proxy.conf

COPY ./entrypoint.sh /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]

HEALTHCHECK --interval=10s --timeout=5s --start-period=3s --retries=3 CMD curl --fail http://localhost
