# ETNA Rank

[![Dev build](https://github.com/flavienbwk/etna-rank/actions/workflows/build-dev.yaml/badge.svg)](https://github.com/flavienbwk/etna-rank/actions/workflows/build-dev.yaml)
[![Prod build](https://github.com/flavienbwk/etna-rank/actions/workflows/build-prod.yaml/badge.svg)](https://github.com/flavienbwk/etna-rank/actions/workflows/build-prod.yaml)

Unofficial ranking page for ETNA students.

![ETNA Rank logo](./app/app/public/logo192.png)

## Why ?

ETNA-rank allows you to keep track of your Grade Point Average (GPA) for your current year of formation. You need an ETNA account to log-in.

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

## Deploy the project (production, Ansible)

:information_source: We recommend using VPS [Instances from Scaleway](https://www.scaleway.com/fr/instances-virtuelles/)

<details>
<summary>Steps for deploying the project with Ansible</summary>
<br>

At this step, we expect you to have :

- Ansible [installed](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) on your machine
- A configured SSH access with your VPS

The following role was tested with _Ubuntu 22.04_ only.

```bash
# CHANGE remote_host AND ansible_user WITH YOURS
ansible-playbook -i ./ansible/inventory.ini ./ansible/deployment.yml --extra-vars "ansible_user=root remote_host=xxx.xxx.xxx.xxx domain=etna.tk"
```

This playbook exposes port `443` of the machine

</details>

## Deploy the project (production, K8S)

:warning: We recommend using [Kubernetes Kapsules from Scaleway](https://scaleway.com). At this step, we expect you to have a working Kubernetes configuration with Ingress installed.

<details>
<summary>Steps for deploying the project with Kubernetes</summary>
<br>

1. Create namespace

    ```bash
    kubectl create ns etna-rank
    ```

2. Update ingress endpoint

    In [`./k8s/ingress.yaml`](./k8s/ingress.yaml), edit the `964c196d-dee5-41e2-b8ae-a11acfbdd425.nodes.k8s.fr-par.scw.cloud` prefix accordingly to your Scaleway configuration.

3. Tagging and pushing images (ETNA-rank development team only)

    First, you need a [container Registry](https://console.scaleway.com/registry) to then tag your images. Here is an example :

    ```bash
    # Nginx container
    docker build ./nginx -f ./nginx/k8s.Dockerfile -t ghcr.io/flavienbwk/etna-rank/nginx:latest
    docker push ghcr.io/flavienbwk/etna-rank/nginx:latest

    # App container
    docker build ./app -f ./app/prod.Dockerfile -t ghcr.io/flavienbwk/etna-rank/app:latest
    docker push ghcr.io/flavienbwk/etna-rank/app:latest

    # API container
    docker build ./api -f ./api/prod.Dockerfile -t ghcr.io/flavienbwk/etna-rank/api:latest
    docker push ghcr.io/flavienbwk/etna-rank/api:latest
    ```

4. Run etna-rank (app & API)

    ```bash
    kubectl apply -f ./k8s
    ```

</details>

## Run the project (production, serverless)

Want to go serverless ? You might want to host this project on [Scaleway Containers](https://www.scaleway.com/fr/serverless-containers/) instances.

<details>
<summary>Steps for deploying the project serverless</summary>
<br>

We first need to deploy our API so our app can know what the API endpoint is.

1. Get your Container Registry endpoint

    ```bash
    export SCW_REGISTRY=rg.fr-par.scw.cloud/funcscwetnarankpduzntz8
    ```

2. Build and ship the API

    In this step we're going to :

    - Build the API image
    - Tag and push it to your provided Scaleway's Containers Registry
    - **Retrieve API's URI** (i.e: `https://etnarankpddqzdf6-api.functions.fnc.fr-par.scw.cloud`)

    ```bash
    _IMAGE_API=$SCW_REGISTRY/api
    _TAG_API=latest
    TAG=$_TAG_API IMAGE_API=$_IMAGE_API docker-compose -f prod.docker-compose.yml build api
    docker push "$_IMAGE_API:$_TAG_API"
    ```

    Deploy your container with [appropriate env variables](./prod.docker-compose.yml#L28).

3. Defining API endpoint

    Create your `.env` file :

    ```bash
    cp .env.example .env
    ```

    In `.env`, edit the `API_ENDPOINT` and `APP_ENDPOINT` values with the container endpoint provided to you in the _Container Settings_ tab of your **API** container.

4. Build and ship the app

    In this step we're going to :

    - Build the app image with API endpoint
    - Tag and push it to your provided Scaleway's Containers Registry

    ```bash
    _IMAGE_APP=$SCW_REGISTRY/app
    _IMAGE_TAG=latest
    TAG=$_IMAGE_TAG IMAGE_APP=$_IMAGE_APP docker-compose -f prod.docker-compose.yml build app
    docker push "$_IMAGE_APP:$_IMAGE_TAG"
    ```

    Deploy your app container.

</details>
