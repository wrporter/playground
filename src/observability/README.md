# Observability

This is a project for experimenting with observability, specifically logs, metrics, and traces.

## Getting Started

1. Run
    ```shell
    docker-compose up --build
    ```
2. Open http://localhost:9797
3. Try out querying metrics from Prometheus with `sum(http_request_duration_seconds_bucket) by (path)`
4. Try out querying logs from Loki with `{host=~".+"} | json`
5. Try out inspecting recent traces from Tempo using the Search tab

## Todo

1. Send everything through the OpenTelemetry Collector rather than scraping metrics via Prometheus and sending logs straight to Loki.
