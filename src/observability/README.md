# Observability

This is a project for experimenting with observability, specifically logs, metrics, and traces.

## Getting Started

1. Install the Docker Loki driver to scrape logs from a Docker container standard output and send them to Loki.  
    ```shell
    docker plugin install grafana/loki-docker-driver:2.9.2 --alias loki --grant-all-permissions
    ```
2. Copy `.env.example` and name it `.env`.
3. Run
    ```shell
    docker-compose up --build
    ```
4. View metrics at http://localhost:22600
5. Visit the Node server at http://localhost:4333
6. Open Grafana at http://localhost:9797, login with username admin and password admin
7. Try out querying metrics from Prometheus with `sum(http_request_duration_seconds_bucket) by (path)`
8. Try out querying logs from Loki with `{host=~".+"} | json`
9. Try out inspecting recent traces from Tempo using the Search tab
10. Make adjustments to see how logs work.
11. Make adjustments to see how metrics work.
12. Make adjustments to see how traces work.

## Todo

1. Send everything through the OpenTelemetry Collector rather than scraping metrics via Prometheus and sending logs straight to Loki.
