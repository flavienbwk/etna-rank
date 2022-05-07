# Stage 1 : build
FROM node:18.1.0-alpine AS builder

ARG NODE_ENV

WORKDIR /app

COPY ./app /app

RUN npm install
RUN npm run build --production

# Stage 2 : serve
FROM node:18.1.0-alpine

WORKDIR /app

COPY --from=builder /app/build .

RUN npm install -g serve

EXPOSE 8080
ENTRYPOINT ["serve", "-l", "tcp://0.0.0.0:8080", "-s", "/app"]
