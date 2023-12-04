---
title: Mac 환경에서 NGINX 설치하고 도메인 붙이기
description: 맥 환경에서 Nginx를 설치하고 도메인을 부여하는 과정에 대해 알아보자.
slug: mac-nginx-install
author: 박하람
category: Web Server
datetime: 2023. 12. 04.
language: Korean
featured: None
tags:
  - blazegraph
  - bulk data
  - fastload.properties
---

맥 환경에서 `nginx`를 설치해야 할 일이 생겼다. 우분투 환경에서 여러 번 `nginx`는 설치해봤는데, 맥 환경에서 설치하는 건 처음이다. 전반적으로 우분투 환경에서 설치하는 것과 비슷하지만, `homebrew` 환경에서 설치하는 게 조금 다르다. 설치는 [mac에 nginx 설치하기](https://velog.io/@davelee/mac%EC%97%90-nginx-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0)와 [Let's Encrypt를 이용한 SSL 인증서 발급 받기](https://velog.io/@sodkdlel123/Lets-Encrypt%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-SSL-%EC%9D%B8%EC%A6%9D%EC%84%9C-%EB%B0%9C%EA%B8%89-%EB%B0%9B%EA%B8%B0)의 블로그 글을 참고했다.

### `homebrew`로 `nginx` 설치하기

먼저 `nginx`가 설치되어 있지 않은지 확인하고, `homebrew`로 `nginx`를 설치한다.

```bash
brew services # homebrew로 설치된 서비스 확인
brew install nginx  # homebrew로 nginx 설치하기
```

`nginx`가 설치되면 8080 포트에서 `nginx`가 실행된다. 브라우저에서 `localhost:8080`으로 접속하면 아래와 같이 Welcome to nginx!라는 기본 화면이 뜬다.

![nginx html](/mac-nginx-install/nginx-html.png)

### 포트 8080에서 80으로 변경하기

`homebrew`로 `nginx`를 설치하면, `/usr/local/etc/nginx/nginx.conf`의 경로에 `conf` 파일이 생성된다. 일반적으로 웹 서버는 80 포트에서 실행되므로, `nginx`가 열리는 포트는 80 대신 8080 포트로 바꿔주는 것이 편하다. `conf` 파일을 변경하는 것이라 `sudo`로 접속해야 한다.

```bash
sudo vim /usr/loca/etc/nginx/nginx.conf  # vim으로 conf 파일 열고 포트 변경 후 저장
brew services restart nginx  # nginx 재시작
```

`conf` 파일에서 서버가 `listen`하는 포트를 8080에서 80으로 변경한다. `conf` 파일을 변경했다면, `nginx`를 다시 시작하고 `localhost:80` 또는 `localhost`로 접속한다. `localhost:80`으로 접속했을 때 `nginx`의 초기 html 화면이 나온다면 정상적으로 포트가 변경된 것이다.

![nginx html](/mac-nginx-install/port-change.png)

### sites-available과 sites-enabled 설정

우분투 환경에서 `nginx`를 설정하면, `sites-available`과 `sites-enabled` 폴더가 자동생성된다. 보통 `sites-available`은 비활성화된 설정을 담아놓고, 활성화하고 싶을 때 `sites-available`에 있는 파일을 `sites-enabled` 폴더에 심볼링 링크를 건다. `homebrew`는 2개의 폴더를 자동으로 생성해주지 않아서 직접 폴더를 만든다.

```bash
# 폴더 생성하기
mkdir sites-available
mkdir sites-enabled
```

보통은 서브도메인별로 `sites-available` 폴더에 설정이 담긴 파일을 생성한다.

```bash
# 폴더에 들어가 개별 도메인에 대한 conf 파일 설정하기
cd mkdir sites-available
vim test.domain.com
```

`test.domain.com`이란 파일을 생성하고, 다음의 코드를 작성한다.

- `server_name`: 웹서버와 연결할 도메인 이름을 작성한다.
- `access_log`와 `error_log`: 로그가 담길 경로와 파일명을 작성한다.
- `root`: 웹 서버가 html을 불러올 홈 디렉토리를 작성한다. 해당 경로에 위치한 모든 폴더에서 웹 서버가 `html`을 읽어드린다.
- `try_files`: 웹 서버가 원하는 파일을 찾지 못할 경우 404 Not Found 오류를 반환한다.

```nginx
server {
    server_name test.domain.com;
    access_log /var/log/nginx/hike.cau.ac.kr.access.log;
    error_log /var/log/nginx/hike.cau.ac.kr.error.log;

    location / {
        root /Users/harampark/Documents/server;
        index index.html;
        try_files $uri $uri/ =404;
    }
}
```

### 심볼릭 링크 걸기

`sites-available` 폴더에서 `test.domain.com` 파일을 작성했다면, `sites-enabled` 폴더과 `sites-available` 폴더에 있는 `test.domain.com`의 파일을 심볼릭 링크로 연결한다. 심볼릭 링크는 `sudo` 환경에서 설정한다.

```bash
sudo ln -s /usr/local/etc/nginx/sites-available/hike.cau.ac.kr /usr/local/etc/nginx/sites-enabled/hike.cau.ac.kr
```

정상적으로 심볼릭 링크가 걸어졌는지 확인하려면 `sites-enabled`에 들어가 `test.domain.com` 파일이 생겼는지 확인한다. `test.domain.com`의 설정을 바꾸고 싶다면, `sites-available`의 폴더에 있는 `test.domain.com` 파일을 수정하면 된다. `sites-available` 폴더에 있는 파일이 수정되면 심볼릭 링크가 걸린 파일은 자동으로 수정된다. 심볼링 링크를 걸어주지 않으면 `nginx`에 변경된 사항이 반영되지 않으므로!!! 심볼릭 링크를 걸어주는 것을 잊지 말자!

### 설정 변경 테스트하기

새로운 설정이 잘 적용됐는지 확인하려면 다음의 코드를 작성하면 된다. 주석처리 해 놓은 것과 같이 결과가 잘 나타나면 설정 변경에 오류가 없는 것이다. 마지막으로 `nginx`를 재시작하면 설정을 변경한 것이 적용된다.

```bash
sudo nginx -t
# nginx: the configuration file /usr/local/etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /usr/local/etc/nginx/nginx.conf test is successful
brew services restart nginx
```

변경한 홈디렉토리인 `/Users/harampark/Documents/server`에 있는 `index.html` 파일이 `localhost:80`에도 보인다면, 홈디렉토리의 변경은 잘 된 것이다. 마지막으로 웹 브라우저에 `test.domain.com`을 접속했을 떄 홈 디렉토리에 있는 `index.html` 파일이 보인다면 성공적으로 웹 서버와 도메인을 연결했다!
