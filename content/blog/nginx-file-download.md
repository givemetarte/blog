---
title: Nginx에서 파일 다운로드 서버 만들기
description: 원하는 경로에서 Nginx로 파일 다운로드 서버를 빠르게 만들어보자.
slug: nginx-file-download
author: 박하람
category: Web Server
datetime: 2024. 05. 10.
language: Korean
featured: None
tags:
  - nginx
  - autoindex
  - file download server
---

빠르게 파일 다운로드 서버를 만들라는 요청을 받았다. 기존에 운영하고 있던 서버는 Mac에서 Nginx를 운영하고 있었는데, 간단한 구문 추가로 파일 다운로드 서버를 쉽게 만들 수 있다. 이 포스팅의 코드는 [이 블로그](https://blog.ifixcomputer.org/2021/02/nginx-%ED%8C%8C%EC%9D%BC-%EB%B0%8F-%EC%82%AC%EC%A7%84-%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C-%EC%84%9C%EB%B2%84-%EB%A7%8C%EB%93%A4%EA%B8%B0-%EB%B0%8F-%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C-%EC%86%8D/#google_vignette)를 참고했다.

### Nginx에 파일 다운로드 서버 추가하기

우선 다운로드 받을 파일을 원하는 경로에 저장하고, `nginx.conf` 파일을 수정한다. 맥의 경우 `nginx.conf` 파일은 `/usr/local/etc/nginx`에 있다. 도메인이 `test.domain.com`이고, 하위 경로를 `/file/download/`로 설정하고 싶다면 다음과 같이 작성하면 된다.

- `alias`: 다운로드 할 파일이 저장된 경로를 작성한다.
- `autoindex`: 자동으로 해당 폴더의 파일 또는 폴더 목록을 html 형식으로 보여준다. `on`을 할 경우 해당 폴더에 있는 파일 목록을 제공하고, 클릭 시 다운로드가 가능하다.

```nginx
server {
    server_name test.domain.com;

    location /file/download/ {
        alias /path/to/file/;
        autoindex on;
        access_log /usr/local/etc/nginx/down.access.log;
        error_log /usr/local/etc/nginx/down.error.log;
        index index.html index.htm index.php;
        charset utf-8;
    }
}
```

### `nginx -t` 에러

위와 같이 작성하고, `nginx -t`로 잘 돌아가는지 테스트 했는데, 다음과 같은 에러가 나타났다. `down.access.log`를 여는데 접근권한 문제로 실패했다는 것이다.

```bash
nginx -t
# nginx: the configuration file /usr/local/etc/nginx/nginx.conf syntax is ok
# nginx: [emerg] open() "/usr/local/etc/nginx/down.access.log" failed (13: Permission denied)
# nginx: configuration file /usr/local/etc/nginx/nginx.conf test failed
```

[stackoverflow에서 참고한 글](https://stackoverflow.com/questions/18714902/nginx-permission-denied-for-nginx-on-ubuntu)에 따르면, superuser로 nginx -t를 실행해야 한다는 것이다. 따라서 `sudo nginx -t`를 입력하면 nginx가 정상적으로 작동한다. 이후 `brew services reload nginx`를 실행한다. `test.domain.com/file/download/` 경로로 접속하면 다음과 같이 해당 폴더에 있는 파일 목록을 확인할 수 있다.

![nginx file](/nginx-file-download/nginx-file.png)
