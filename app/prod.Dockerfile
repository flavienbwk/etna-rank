# Stage 1 : build
FROM node:18.1.0-alpine AS builder

ARG NODE_ENV
ARG CHOKIDAR_USEPOLLING
ARG REACT_APP_API_ENDPOINT

WORKDIR /app

COPY ./app /app

RUN npm install
RUN npm run build --production --omit=dev

# Stage 2 : serve
FROM node:18.1.0-alpine

WORKDIR /app

RUN apk update && apk add curl

COPY --from=builder /app/build .

RUN npm install -g serve

ENTRYPOINT ["serve", "-l", "tcp://0.0.0.0:8080", "-s", "/app"]

EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 CMD curl --fail http://localhost:8080
