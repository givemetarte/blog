---
title: flask 도커라이징하기 (Dockerfile 생성하기)
description: 로컬에서 flask 앱을 만들고 우분투 서버에서 실행하기 위해 도커라이징을 진행했다. 간단하게 Dockerfile을 만들어 도커 이미지를 생성하고 도커를 run하는 방법에 대해 알아보자.
slug: flask-dockerizing
author: 박하람
category: Linux&Docker
datetime: 2023. 12. 18.
language: Korean
featured: None
tags:
  - flask
  - docker
  - Dockerfile
---

보통은 개발할 때 로컬에서 웹 어플케이션을 개발한 다음, 도커라이징을 한다. 로컬은 맥 환경이고 서버는 우분투 환경이라 로컬에서 잘 작동하는데도 서버에서 잘 안될 때가 있어서...🥲 웹 어플리케이션을 도커라이징 한 다음에 서버로 올리면 서버 환경에서 대부분 무사히 잘 작동한다. 이번 포스팅은 flask로 만든 웹 어플리케이션을 도커라이징 하는 방법에 대해 알아본다.

### Dockerfile 생성하기

서버의 도커 환경에서 flask를 실행하려면, (1) `Dockerfile` 생성 (2) docker image build (3) docker run의 과정으로 진행된다. flask에 대한 `Dockerfile`은 다음과 같이 만들 수 있다. 참고로 Dockerfile을 생성할 때 철자에 주의하자. 종종 `DockerFile`로 입력해서 도커 이미지가 빌드되지 않을 수 있다.

- `FROM python:3.9 `: Python 3.9 기반의 도커 이미지 사용
- `ENV PYTHONIOENCODING=utf-8`: Python 인코딩으로 utf-8 사용
- `WORKDIR /app`: 컨테이너 내의 작업 디렉토리를 /app으로 설정
- `COPY . .`: 현재 디렉토리와 모든 파일을 /app으로 복사
- `RUN pip install --upgrade pip`: pip 업그레이드
- `RUN pip install -r requirements.txt`: 모든 의존성 패키지 설치
- `CMD ["python", "main.py"]`: 컨테이너 시작할 때 실행할 기본 명령어

```Dockerfile
FROM python:3.9

ENV PYTHONIOENCODING=utf-8

WORKDIR /app

COPY . .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

CMD ["python", "main.py"]
```

### Docker Image 빌드하기

도커파일은 도커 이미지를 만드는 데 사용된다. 도커 이미지는 `Dockerfile`이 있는 경로에서 다음을 입력하면 `flask-api-server`라는 이름으로 생성된다. `-t`가 붙은 다음이 해당 이미지의 이름이고, : 옆은 해당 이미지의 버전을 입력할 수 있다. 마지막 온점은 해당 폴더에 있는 모든 파일에 대해 도커 이미지를 생성한다는 것이다. (온점 적는 것을 까먹지 말자!)

```bash
docker build -t flask-api-server:1.0.0 .
```

위의 코드를 작성하면 다음과 같이 build가 시작되면서 에러 없이 끝나야 docker build가 성공한 것이다.
![docker build](/flask-dockerizing/docker-build-ubuntu.png)

도커 이미지가 잘 빌드되었는지 확인하려면 다음의 코드를 입력한다. `REPOSITORY`는 `flask-api-server`, `TAG`는 `1.0.0`으로 된 이미지가 있다면 성공적으로 빌드한 것이다.

```bash
docker images
```

### Docker run

도커 이미지를 실행하는 방법은 다음과 같다. `-d` 옵션은 백그라운드에서 실행한다는 의미이고, `-p`는 열리는 포트를 지정하는 역할을 한다. 기본적으로 flask는 5001번 포트에서 열리고 있는데, 변경할 필요가 없어서 그대로 5001 포트를 부여했다. `--name`는 도커의 이름을 정한다. 마지막은 도커 이미지의 이름과 버전을 입력한다.

```bash
docker run -d -p 5001:5001 --name flask-api-server flask-api-server:1.0.0
```

무사히 실행되었다면, 5001번 포트에서 flask의 홈화면이 잘 보일 것이다!
