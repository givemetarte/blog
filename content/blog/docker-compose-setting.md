---
title: 백엔드와 프론트엔드를 한번에 실행하는 Dockerfile과 docker-compose.yml 파일 만들기
description: 백엔드와 프론트엔드를 개발하고 Deploy하는 과정에서 docker compose를 사용해 패키징하는 방법을 설명한다.
slug: docker-compose-setting
author: 박하람
category: Linux&Docker
datetime: 2024. 08. 20.
language: Korean
featured: None
tags:
  - docker-compose
  - Dockerfile
---

백엔드와 프론트엔드를 개발하고 마지막으로 deploy할 때 도커 기반으로 패키징하는 편이다. deploy할 환경에 관계없이 개발한 어플리케이션을 서버에 올릴 수 있기 때문에 웬만하면 도커 패키징을 하려고 한다. 기존에 `Dockerfile`을 사용해 도커라이징은 해봤지만, 여러 개의 `Dockerfile`을 묶어 docker compose 방식으로 한번에 어플리케이션을 실행하는 방식은 해보지 않았다. 이번 포스팅은 백엔드와 프론트엔드의 `Dockerfile`을 생성하고 docker compose로 한번에 어플리케이션을 실행하면서 배웠던 점에 대해 설명한다. `Dockerfile`과 `docker-compose.yml` 파일의 작성은 ChatGPT의 도움을 받았다😺

### 프로젝트의 디렉토리 구조

프로젝트의 디렉토리 구조는 다음과 같다. 크게 `backend` 폴더와 `frontend` 폴더를 갖고 있고, 가장 상단의 경로에서 `docker-compose.yml` 파일을 생성한다. `backend` 폴더 안에서 flask 기반의 백엔드를 도커라이징하는 `Dockerfile`을 생성하고, 도커라이징할 때 포함하지 않을 파일이나 경로는 `.dockerignore`에 작성한다. `frontend`도 동일하게 `Dockerfile`과 `.dockerignore`를 생성한다.

```
project
├─ .gitignore
├─ README.md
├─ docker-compose.yml
├─ backend
│  ├─ .dockerignore
│  ├─ Dockerfile
│  ├─ requirements.txt
│  ├─ .env
│  ├─ main.py
│  └─ wsgi.py
└─ frontend
   ├─ .dockerignore
   ├─ Dockerfile
   ├─ .env
   ├─ app.vue
   ├─ assets
   ├─ components
   ├─ nuxt.config.ts
   ├─ package-lock.json
   ├─ package.json
   ├─ pages
   ├─ public
   ├─ server
   └─ tsconfig.json
```

### 백엔드: Flask의 Dockerfile 생성하기

백엔드는 Flask 기반의 프레임워크를 사용한다. `requirements.txt`에 사용한 모듈이 모두 작성되어 있고, `gunicorn`으로 백엔드를 배포하는 형태라면 다음과 같이 `Dockerfile`을 작성할 수 있다. `.dockerignore` 파일은 `__pycache__`나 venv로 생성한 가상환경 폴더 등을 작성하면 된다.

- 파이썬 이미지는 `3.12-slim`이다. 사용한 모듈이 최소 3.12 버전이어야 돌아가는 것이 많아서 3.12 버전을 선택했고, 꽤나 무거운 어플리케이션이라 최대한 이미지의 크기를 최소화할 수 있는 slim 버전을 사용했다.
- 두번째 `RUN apt-get`으로 시작하는 구문은 파이썬 서버를 구동할 때 필요한 도구를 설치할 때 필요하다. 이 코드 없이 나머지로 빌드를 수행했을 때, `pip install -r requirements.txt`에서 계속해서 오류가 발생했다. 사용한 모듈이 컴파일러(gcc), 링커(ld), C/C++ 등의 코드를 빌드하고 있어서 이 코드도 함께 실행했다. 마지막의 `rm -rf` 코드는 캐시된 패키지 리스트를 삭제해 이미지의 크기를 줄이는데 사용했다.
- 나머지 줄은 working directory로 app을 설정하고, pip를 업그레이드한 다음 `requirements.txt`에 있는 모든 모듈을 설치하는 방식이다. 실행은 `gunicorn` 명령어를 사용하며, 5000 포트에서 백엔드가 동작한다.

```docker
FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "main:app"]
```

### 프론트엔드: Nuxt의 Dockerfile 생성하기

프론트엔드는 Nuxt를 기반으로 실행되며, Nuxt 어플리케이션을 도커라이징하는 Dockerfile은 다음과 같다. Nuxt는 이미지 최적화를 위해 builder 단계와 deploy 단계로 구분한다. `.dockerignore`는 불필요한 `node_modules`, `*.log`, `.git` 등을 추가하면 된다.

- builder 단계는 `package.json`과 `package*.json`을 기반으로 모듈을 설치한 다음, `npm run build`로 deploy를 위한 static 파일을 생성한다. 이 때 static 기반으로 nuxt를 실행하는 파일이 담긴 `.output` 폴더가 생성된다.
- Deploy 단계는 builder에서 생성한 `.output` 폴더만 복사해 최종 생성될 이미지의 크기를 최소화한다. 이런 방식으로 이미지를 빌드하면 불필요한 소스코드나 빌드도구 등이 최종 이미지에 포함되지 않아 이미지의 크기가 작아진다. 또한, `.output` 폴더만 복사하기 때문에 불필요한 단계가 재실행되지 않고 캐시가 효과적으로 사용될 수 있다. 최종적으로 프론트엔드는 3000 포트에서 실행되고, 빌드된 static 파일 기반으로 nuxt가 실행된다.

```docker
# Step1: builder
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Step 2: Deploy
FROM node:18

WORKDIR /app

COPY --from=builder /app/.output /app/.output

COPY package*.json ./

RUN npm install --production

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

### docker-compose.yml 생성하기

앞서 설명한 백엔드와 프론트엔드의 Dockerfile이 모두 생성되었다면, `docker-compose.yml` 파일을 생성할 수 있다. 도커 컴포즈 버전은 `depends_on`을 사용할 수 있는 3.8 버전을 사용한다. 백엔드와 프론트엔드를 한번에 실행하는 `docker-compose.yml` 파일은 다음과 같이 작성한다.

- `services`의 하위 항목으로 `backend`와 `frontend`를 작성한다.
- `build` 아래의 `context`는 해당 컴포넌트가 위치한 상대 폴더 경로를 작성하고, `dockerfile`은 `Dockerfile`로 작성한다. 소문자인 `dockerfile`로 작성할 경우 인식하지 않으니 꼭 대문자로 작성해야 한다.
- `ports`는 개별 컴포넌트가 실행될 포트를 작성한다.
- `env_file`는 개별 컴포넌트가 사용하는 `.env` 파일이 위치한 상대경로를 작성한다.
- `depones_on`는 특정 컴포넌트가 실행되기 전에 미리 실행되어야 할 컴포넌트를 작성한다. `frontend`는 `backend`가 실행된 후 작동하도록 설정했다.

```yml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - '5000:5000'
    env_file:
      - ./backend/.env

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    env_file:
      - ./frontend/.env
    depends_on:
      - backend
```

### docker-compose 실행하기

위와 같이 `Dockerfile`과 `docker-compose.yml` 파일이 작성됐다면, 다음과 같이 실행할 수 있다. 주의할 점은 `docker-compose up`과 `docker-compose down`을 반복할 경우 상당히 많은 cache가 쌓이게 된다. 갑자기 디스크가 부족하다는 경고가 뜨면, `docker system prune`으로 깨끗하게 사용하지 않는 도커 잔유물(?)들을 지워주자!

```bash
# 이미지 빌드 후 실행
docker-compose up --build
# 이미지 빌드 후 백그라운드에서 실행
docker-compose up --build -d
# 도커 컴포즈로 실행되는 컨테이너 확인
docker-compose ps
# 실행 중인 모든 컨테이터, 볼륨, 이미지 삭제
docker-compose down
# 사용하지 않는 도커 이미지, 컨테이너 등 제거
docker system prune
```
