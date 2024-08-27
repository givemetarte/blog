---
title: Mac에서 Nginx 에러 로그 확인하고 해결하기 (Permission denied, Operation not permitted)
description: Mac에서 Nginx를 설치한 경우 접근 권한 문제가 생길 수 있다. Nginx의 에러 로그를 기반으로 에러를 해결한 방법에 대해 설명한다.
slug: nginx-mac-error
author: 박하람
category: Web Server
datetime: 2024. 08. 27.
language: Korean
featured: None
tags:
  - nginx
  - mac
  - Permission denied
  - Operation not permitted
---

[이전 포스팅](/blog/nginx-mac-install)에서 Mac에 Nginx 설치하는 방법에 대해 설명했다. 오늘은 갑자기 서버가 정전으로 꺼졌다가..🥲 다시 실행했더니 alias로 static page를 연결한 페이지가 404 error가 발생했다. 오늘 포스팅은 Nginx의 에러 로그를 기반으로 에러를 해결한 방법에 대해 설명한다. 이번 에러 해결은 ChatGPT가 큰 도움이 됐다!

### Permission denied 에러

Nginx에 다음과 같이 `alias`로 static page를 연결해놨는데, 이렇게 연결된 페이지는 모두 접근이 불가능했다. 원래라면 `test.domain.com/test/`에 접속했을 때 해당 경로에 있는 `index.html` 페이지가 잘 나오는데 계속해서 404 에러가 떴다.

```nginx
server {
    server_name test.domain.com;
    ...
    location /test/ {
        alias /Users/harampark/Documents/test/;
        try_files $uri $uri/ =404;
    }
}
```

정확한 오류 확인을 위해 다음과 같이 에러 로그를 확인했다. 맥의 경우 다음의 경로에서 `error.log`를 확인할 수 있고, 끝부분을 보여준다. 확인해보니 이 경로에 접근할 수 없다는 `Permission denied` 에러가 떴다.

```bash
tail -f /usr/local/var/log/nginx/error.log
# 2024/08/27 15:59:51 [error] 5886#0: *1 "/Users/harampark/Documents/test/index.html" is
# forbidden (13: Permission denied), client: 127.0.0.1, server: test.domain.com, request: "GET /test/
# HTTP/1.1", host: "test.domain.com"
```

이 경우는 보통 nginx가 해당 디렉토리에 접근할 수 있는 권한이 없어 생긴 결과였다. [이 포스트](https://velog.io/@lua_aw/macOS-nginx%EB%A1%9C-%EC%9B%B9%EC%84%9C%EB%B2%84-%EB%9D%84%EC%9A%B0%EA%B8%B0)에서 설명한 것처럼 nginx가 해당 디렉토리에 접근할 수 있는 권한이 없어서 생기는 문제였다. 다음의 코드로 해당 디렉토리의 접근권한을 확인할 수 있다.

```bash
ls -ld /Users/harampark/Documents/test/
# drwxr--r--  15 harampark  staff  480  8 27 14:24 /Users/harampark/Documents/test/
```

`drwxr--r--`은 접근권한을 나타내는데, 접근권한은 다음과 같이 해석하면 된다. 이 경로의 접근권한은 기타 사용자인 nginx가 실행(x)이 불가능한 권한이므로 Permission denied 에러가 발생했다. (nginx는 보통 nobody라는 이름으로 접근되어 기타 사용자에 속한다고 한다.)

- 맨 앞의 `d`: 디렉토리를 의미함
- `rwxr--r--`: 권한 설정을 나타냄

  - `rwx`: 소유자(harampark)의 읽기, 쓰기, 실행 권한 부여
  - `r--`: 그룹(staff)의 읽기 권한만 부여
  - `r--`: 기타 사용자의 읽기 권한만 부여

따라서 다음의 755로 디렉토리의 접근권한을 바꿔준다. 755는 접근권한을 `drwxr-xr-x`로 변경하는데, 그룹과 기타 사용자에게 읽고 실행할 수 있는 권한을 부여한다. 위의 `ls -ld` 코드로 접근 권한이 바뀌었는지 확인하고 웹 서버를 다시 재부팅해주면 된다.

```bash
sudo chmod -R 755 /Users/harampark/Documents/test/
sudo nginx -t
sudo brew services nginx reload
```

### Operation not permitted

그러나 앞서 나타난 에러를 해결해도 `test.domain.com/test/`에 접속되지 않았다. 에러 로그를 확인하니 이제는 새로운 `Operation not permitted`란 에러가 발생했다.

```bash
# 2024/08/27 16:01:10 [crit] 6160#0: *1 open() "/Users/harampark/Documents/test/index.html"
# failed (1: Operation not permitted), client: 127.0.0.1, server: test.domain.com, request: "GET /test/
# HTTP/1.1", host: "test.domain.com"
```

아무리 어떤 것을 해도 해결되지 않다가... Mac의 보안기능으로 특정 디렉토리나 파일에 접근 제한될 수 있다는 것을 알게 됐다. 이 경우는 Settings(시스템 환경설정) - Privacy & Security(보안 및 개인 정보 보호) - Files & Folders(파일 및 폴더)와 Full Dist Access(전체 디스크 접근)에서 nginx에게 접근 권한을 허용해줘야 한다!

이렇게 설정해주고 nginx를 다시 실행했더니 드디어 `test.domain.com/test/`에 접근이 가능해졌다! 만세!
