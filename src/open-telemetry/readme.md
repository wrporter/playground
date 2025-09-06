1. Install the Loki plugin
    ```shell
    docker plugin install grafana/loki-docker-driver:2.9.2 --alias loki --grant-all-permissions
    ```
2. Run all the things
    ```shell
    docker-compose up
    ```
