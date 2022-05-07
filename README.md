# ETNA Rank

<p align="center">

[![Dev build](https://github.com/flavienbwk/etna-rank/actions/workflows/build-dev.yaml/badge.svg)](https://github.com/flavienbwk/etna-rank/actions/workflows/build-dev.yaml)
[![Prod build](https://github.com/flavienbwk/etna-rank/actions/workflows/build-prod.yaml/badge.svg)](https://github.com/flavienbwk/etna-rank/actions/workflows/build-prod.yaml)

Unofficial ranking page for ETNA students.

![ETNA Rank logo](./app/app/public/logo192.png)

</p>

## Why ?

ETNA-rank allows you to keep track of your Grade Point Average (GPA) for your current year of formation.

:point_right: Want to contribute ? Feel free to open a pull request or fill an issue !

## Why we need to ask for your password ?

We first tried to build ETNA-rank as an app-only project. However, built-in securities in all major browsers [don't allow for cross-site authentication token retrieval](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).

**Your password is NEVER stored.** You can check our code.

If you're still afraid about us storing your password, run the project by yourself following the steps below. But again : we - don't - store - your - password.

## Run the project (development)

Run each of these commands one after the other :

```bash
docker-compose build
docker-compose up -d
```

Access to the app at `https://localhost:10102`

## Run the project (staging)

This build is for making sure etna-rank is self-contained with all necessary dependencies and configuration to be deployed for production as well as being ready for Kubernetes.

<details>
<summary>Steps for running the project as staging</summary>
<br>

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

</details>
