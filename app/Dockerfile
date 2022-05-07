FROM node:18.1.0-alpine

RUN apk update && apk add curl

WORKDIR '/app'

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]

EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=20 CMD curl --fail http://localhost:8080
