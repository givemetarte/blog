---
title: CORS 에러 때문에 막힌 SPARQL 엔드포인트를 작동시켜 보자!
description: 웹 어플리케이션 개발할 때마다 SPARQL 엔드포인트가 CORS 에러 때문에 작동하지 않아 골머리를 앓았다. 여러 차례 삽질한 다음에 가장 쉽게 CORS 에러를 우회할 수 있는 방법을 알아냈다!💖
slug: resolve-cors-error
author: 박하람
category: Knowledge Graph
datetime: 2022. 10. 25.
language: Korean
featured: Featured
tags:
  - CORS
  - SPARQL endpoint
  - nginx
  - apache
---

웹 어플리케이션을 개발할 때마다 `SPARQL` 엔드포인트가 `CORS` 에러 때문에 동작하지 않은 적이 많았다. 온갖 블로그를 찾아보며 여러 가지 방법을 시도해봤지만, 직접적인 해결방안을 모르고 이유 없이 작동하는 경우(?)가 있었다. 삽질을 하다가 결국에!!! 해결한 방식은 웹 서버 단에서 우회적으로 `CORS` 에러를 해결하는 방법을 알아냈다!!!😸 바로 웹 헤더에 `Access-Control-Allow-Origin`을 설정해주는 것이다.

### Nginx에서 설정하기

`Nginx`에 설정해주는 방법은 아래와 같이 딱! 2줄만 추가하면 된다. `/blazegraph/`라는 하위 경로에서 `proxy_pass`를 설정해주고, 아래 2줄을 추가한다. 웹 어플리케이션에서 불러올 `SPARQL` 엔드포인트는 `http://test.com/blazegraph/sparql`로 설정해주어야 `CORS` 에러를 우회할 수 있다.

```nginx
server {
    server_name test.com;

    location /blazegraph/ {
        proxy_hide_header Access-Control-Allow-Origin;
        add_header 'Access-Control-Allow-Origin' '*';
        proxy_pass http://localhost:9999/blazegraph/;
    }
}
```

### Apache에서 설정하기

`Apache`도 `Nginx`와 같이 헤더를 설정해주면 된다. 첫번째 줄만 설정해줘도 작동하지만, `nosniff`옵션도 추가해줬다. `SPARQL` 엔드포인트는 마찬가지로 `http://test.com/blazegraph/sparql`로 설정해주면 된다.

```apache
<VirtualHost *:80>
    ServerName test.com

    <IfModule mod_headers.c>
        Header set Access-Control-Allow-Origin "*"
        Header always set X-Content-Type-Options "nosniff"
    </IfModule>
<VirtualHost>
```

### CORS 오류여, 이젠 안녕!

웹 서버 단에서 헤더로 간단히 `CORS` 에러를 우회할 수 있는 방법에 대해 알아보았다. 보안 이슈가 있긴 하지만, 정말.. 무수한 시도 끝에 해결해 낸 방법이다..🥲 `SPARQL` 엔드포인트로 통신할 때마다 나타나는 이슈이니, 도움이 되길 바란다.

참고로, 헤더를 설정해주고도 `SPARQL` 엔드포인트가 동작하지 않을 수 있다. 나의 경우, `SPARQL` 엔드포인트로 데이터를 요청하는 웹 어플리케이션은 `HTTPS`인데, `SPARQL` 엔드포인트가 `HTTP`로 시작할 때 동작하지 않았다 (반대의 경우도 마찬가지다). 이럴 때는 `HTTPS`로 통일하여 통신을 하면 엔드포인트가 잘 동작한다.
