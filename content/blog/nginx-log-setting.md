---
title: Nginx에서 개별 서버마다 로그 설정하기
description: 접근과 에러에 대해 개별 서버마다 서로 다른 로그 파일이 기록될 수 있도록 설정하는 방법에 대해 알아본다.
slug: nginx-log-setting
author: 박하람
category: Web Server
datetime: 2024. 05. 24.
language: Korean
featured: None
tags:
  - nginx
  - access.log
  - error.log
---

Nginx는 기본적으로 전역 로그가 설정되어 있다. 그런데, 로그를 확인하러 들어가니 access와 error 파일이 무지하게 생성되어 있었다..🥲 설정하는 과정에서 관리가 잘 안된 모양인데, 이 김에 개별 서버마다 로그를 다르게 기록할 수 있도록 설정해봤다. 오늘 포스팅에서 nginx 로그 설정 방법은 [이 블로그 글](https://www.vompressor.com/nginx-log/)을 참고했다.

### 로그 보기

서버에 약간 문제가 있는 것 같아, 로그를 확인하려고 보니 아래와 같이 `access.log`과 `error.log`가 많이 생성되어 있었다. 이 로그 파일 더미는 한번에 삭제했다.

![nginx log](/nginx-log-setting/nginx-log.png)

다음의 경로로 접속한 다음, access와 error로 시작하는 모든 파일을 삭제한다.

```bash
cd /var/log/nginx
find . -type f -name 'access*' -exec rm {} \;
find . -type f -name 'error*' -exec rm {} \;
```

### 개별 서버별 로그 생성하기

우선 전역적으로 설정한 `access.log`와 `error.log` 설정을 주석처리한다. `etc/nginx/nginx.conf` 파일에서 다음의 코드를 주석처리한다.

```
# access_log /var/log/nginx/access.log;
# error_log /var/log/nginx/error.log;
```

다음은 서버 별로 폴더를 만들어 `access.log`와 `error.log`를 다시 생성했다. 그 다음은 sites-available 폴더의 개별 서버 설정에서 다음과 같은 코드를 작성한다. `access_log`와 `error_log`의 경로는 개별 파일이 있는 경로를 작성해주면 된다.

```nginx
server {
    server_name test.domain.com www.test.domain.com;
    access_log /var/log/nginx/test.domain.com/access.log; # added
    error_log /var/log/nginx/test.domain.com/error.log; # added
}
```

다음은 nginx의 설정이 잘 반영되도록 nginx를 reload한다.

```nginx
nginx -t
sudo service nginx reload
```

이후 해당 도메인에 다시 접속한 후에 `cat /var/log/nginx/test.domain.com/access.log`를 보면 로그 기록이 남는다.
