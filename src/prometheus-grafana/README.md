# Prometheus & Grafana

This is a project for gathering quick metrics for a local project. It expects prometheus metrics to be exported from http://localhost:22500/metrics. This can be modified in [prometheus/prometheus.yml](prometheus/prometheus.yml).

Run

```shell
docker-compose up
```

Open http://localhost:9797

If no Data Source has been configured, set up a Prometheus data source with hose http://host.docker.internal:9090 and save.
