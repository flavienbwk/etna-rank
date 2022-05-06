# etna-rank

Ranking page for ETNA

## Run the project (développement)

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
docker-compose up -d nginx app
```

Access to the app at `https://localhost:10102`
