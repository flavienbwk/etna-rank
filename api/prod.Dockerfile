FROM python:3.9-slim

WORKDIR /app

RUN apt update && apt install -y curl

COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./app /app
RUN mkdir -p /tmp/etna-rank

RUN echo "uvicorn main:app --host 0.0.0.0 --port 80" > /tmp/entrypoint.sh
RUN chmod +x /tmp/entrypoint.sh
ENTRYPOINT ["/bin/sh", "/tmp/entrypoint.sh"]

EXPOSE 80
HEALTHCHECK --interval=10s --timeout=5s --start-period=3s --retries=3 CMD curl http://localhost
