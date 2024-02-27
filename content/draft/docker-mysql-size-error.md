---
title: 도커로 MySQL...
description: .ddd
slug: docker-mysql-size-error
author: 박하람
category: Linux&Docker
datetime: 2024. 02. 27.
language: Korean
featured: None
tags:
  - docker
---

```
OperationalError: (1114, "The table '/tmp/#sql1_36_0' is full")
```

이런 에러가 뜰 때 다음으로 처리

```bash
docker ps --size --format "table {{.ID}}\t{{.Image}}\t{{.Size}}"

docker container prune # 도커 미사용 컨테이너 삭제
docker image prune # 도커 미사용 이미지 삭제
docker volume prune # 도커 미사용 볼륨 삭제
docker system prune # 도커 미사용 오브젝트 전체 삭제
# Total reclaimed space: 34.15GB
```
