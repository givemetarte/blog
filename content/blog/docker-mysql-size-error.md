---
title: 도커로 MySQL 실행할 때 용량 에러 해결하기 (OperationalError 1114, "The table '/tmp/#sql1_36_0' is full")
description: 도커로 MySQL을 실행하고 테이블에 데이터를 삽입할 때 용량 에러가 떴다. 이 에러를 해결하는 간단한 방법에 대해 알아보자.
slug: docker-mysql-size-error
author: 박하람
category: Linux&Docker
datetime: 2024. 02. 28.
language: Korean
featured: None
tags:
  - docker
---

도커로 MySQL을 실행했는데, 다음과 같은 에러가 생겼다. 이 에러는 MySQL에 테이블을 생성하고 데이터를 집어넣는 과정에서 나타났다. 즉, MySQL의 임시 테이블의 용량이 부족해서 나타난 것인데, 쿼리 실행 과정에서 필요한 임시 데이터를 저장할 공간이 부족하기 때문에 발생하는 에러라고 한다.

```
OperationalError: (1114, "The table '/tmp/#sql1_36_0' is full")
```

나는 다음과 같은 방법으로 간단하게 해결했다. 우선 현재 도커의 용량을 파악하기 위해 다음과 같이 입력한다. 에러가 났을 때는 `SIZE`의 용량이 기가바이트 수준이었다.

```bash
docker ps --size --format "table {{.ID}}\t{{.Image}}\t{{.Size}}"
# CONTAINER ID   IMAGE          SIZE
# 467af4fa77b2   mysql:latest   209B (virtual 638MB)
```

다음은 컨테이너와 이미지, 볼륨, 시스템에서 필요없는 것을 삭제한다. 이번 에러는 `volume`으로 과도한 양이 쌓여있었기 때문인데, `prune`으로 깨끗히 정리했더니 정상적으로 작동했다. `docker-compose`를 삭제하고 실행할 때 많이 도음이 되었던 것이 `docker system prune`이다. 도커가 편하게 어플리케이션을 설치하고 삭제할 수 있다보니 필요없는 용량이 잘 쌓인다. 에러가 발생하기 전에 주기적으로 도커를 다음과 같이 정리해주는 게 도움이 된다.

```bash
docker container prune
docker image prune
docker volume prune
# Total reclaimed space: 34.15GB
docker system prune
```
