---
title: Nginx에서 원하는 디렉토리에 static page를 연결하는 방법
description: vitepress로 구축한 docs에 도메인을 붙일 때, 원하는 디렉토리 경로에서 보여주도록 nginx를 설정해보자.
slug: nginx-static-route
author: 박하람
category: Web Server
datetime: 2024. 03. 26.
language: Korean
featured: None
tags:
  - nginx
  - vitepress
  - deploy
  - vitepress
---

`vitepress`로 구축한 docs 페이지가 있는데, 여기에 도메인을 붙여야 했다. 쉬운 작업이지만 늘상 헷갈려서 기록해둔다. 이번 포스팅은 `nginx`에서 static page를 원하는 디렉토리로 디플로이하는 방법에 대해 설명한다.

### nginx 설정

static page를 `/docs/test/`의 경로에서 보여주고 싶다면, `nginx.conf` 파일 또는 `sites-available`에 있는 `.conf` 파일에 다음과 같이 작성해주면 된다.

- `location` 구문 다음에 원하는 경로인 `/docs/test/`를 작성한다
- `alias`를 사용해 static page가 있는 경로를 설정한다. 본인은 `vitepress`를 build한 `dist` 폴더를 그대로 경로로 설정했다.
- `try_files`에 해당하는 구문은 요청된 파일이 존재하면 그대로 반환하고, 존재하지 않거나 `index.html` 파일이 존재하지 않으면 404 에러를 표시하도록 설정한다.

```nginx
server {
    server_name test.domain.com;
    ...

    location /docs/test/ {
        alias /Users/*****//*****//*****/docs/.vitepress/dist/;
        try_files $uri $uri/ =404;
    }
}
```

다만 유의해야 할 점은 `vitepress`에서 설정해놓은 디렉토리 경로와 일치해야 한다. `vitepress`에서 경로 설정은 다음과 같이 수정할 수 있다.

### 추가: vitepress에서 하위 디렉토리 설정

vitepress는 기본적으로 `/docs/` 라는 디렉토리에서 나타난다. `config.js`에서 `base`에 해당하는 값을 원하는 경로로 설정하면 된다.

```js
// path: docs/.vitepress/config.js
export default {
    title: "...",
    description: "...",
    base: "/docs/test/"
    ...
}
```
