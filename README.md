# etna-rank

Unofficial ranking page for ETNA

## Run the project (development)

Copy `.env.example` and edit `.env` variables :

```bash
cp .env.example .env
```

Run each of these commands one after the other :

```bash
docker-compose build
docker-compose up -d
```

Access to the app at `https://localhost:10102`

## Run the project (staging)

This build is for making sure etna-rank is self-contained with all necessary dependencies and configuration to be deployed for production as well as being ready for Kubernetes

Copy `.env.example` and edit `.env` variables :

```bash
cp .env.example .env
```

Run each of these commands one after the other :

```bash
# Setting up certificates
mkdir ./certs
chmod 700 ./certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./certs/app.key -out ./certs/app.crt
openssl dhparam -out ./certs/dhparam.pem 2048

# Running web platform
docker-compose -f prod.docker-compose.yml build
docker-compose -f prod.docker-compose.yml up -d
```

Access to the app at `https://localhost:10102`
