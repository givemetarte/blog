---
title: Nuxt에서 하위 경로 설정하고, Nginx로 deploy하기 (feat. CORS 에러 해결)
description: Nuxt에서 하위 경로를 추가한 basic URL을 설정하고, Nginx에서 도메인을 붙이고 CORS 에러를 해결하는 방법에 대해 설명한다.
slug: nuxt-subdirectory-deploy
author: 박하람
category: Web Development
datetime: 2024. 08. 19.
language: Korean
featured: None
tags:
  - Nuxt 3
  - Subdirectory
  - Nginx
  - CORS
---

Nuxt 3로 구축한 어플리케이션을 하위 경로에 도메인을 붙여 deploy해야 하는 일이 있었다. 생각보다 손이 많이 가는 작업이었지만, 하위 경로에 deploy하는 방법을 알아냈다! Vue는 [이전 포스팅](/blog/vue-deploy-subdirec)에서 설명한 방식으로 해주면 되는데, Nginx는 `nuxt.config.ts`에서 다른 방식으로 설정해줘야 한다. 이후 Nuxt를 development가 아닌 production 모드로 설정해주고 Nginx로 도메인을 연결해줘야 한다. 생각보다 정리된 문서가 없어서 오늘 포스팅에서 정리해본다.

### Nuxt에서 하위 경로 설정하기

기본 경로에 하위 디렉토리를 추가하고 싶다면 다음과 같이 `nuxt.config.ts`에 추가한다. 아래와 같이 설정하면 `localhost:3000/test/`가 기본 경로가 된다.

```ts
export default defineNuxtConfig({
  app: {
    baseURL: '/test/',
  },
})
```

### Nuxt에서 서버 실행

Nuxt 3로 구축한 웹 어플리케이션의 deploy 방법은 [공식문서](https://nuxt.com/docs/getting-started/deployment)에 설명되어 있다. 다음과 같이 진행하면 안정적인 모드로 deploy가 가능하다.

```bash
npm install
npm run build
node .output/server/index.mjs
```

기존에 개발할 때는 `npm run dev`로 실행하지만, 개발이 끝난 후 deploy는 `npm run build`를 실행한다. 빌드 후 `.output` 폴더가 실행되고, 위의 `node`로 시작하는 구문을 입력하면 Nuxt 웹 어플리케이션이 실행된다.

### Nginx 설정

앞서 실행한 웹 어플리케이션에 도메인(`http://test.domain.com/test/`)을 붙이고 싶다면 다음과 같이 설정한다.

- location 다음은 도메인 다음에 올 하위 경로를 작성한다. 앞서 nuxt에서 설정한 하위 경로와 같은 경로여야 정상적으로 동작한다.
- proxy 설정은 해당 도메인이 클라이언트에서 요청되었을 때 전달할 백엔드 서버의 주소를 작성한다. `proxy_set_header`는 백엔드 서버에 요청을 전달할 때 같이 보낼 HTTP 헤더를 설정한다.
- WebSocket 지원을 위한 설정은 통신에 사용할 HTTP 버전, WebSocket 연결을 위해 필요한 설정을 작성한다.
- CORS 헤더 설정은 Nginx가 다른 도메인에서 오는 요청을 허용한다. 로컬로 백엔드와 통신할 때는 잘 작동하나, 실제 도메인을 붙이면 백엔드와 통신할 때 CORS 에러가 매우 자주 나타나므로 꼭 설정해주는 것이 좋다. (안전하게 모든 도메인을 열어놓는 것이 아니라 특정 도메인만 설정해주는 것이 좋다...(\*가 아닌 도메인 설정!))

```nginx
location /test/ {
    # proxy 설정
    proxy_pass http://localhost:3000/test/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # WebSocket 지원을 위한 설정
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    # CORS 헤더 설정
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Credentials true;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'Origin, Content-Type, Accept, Authorization';
}
```

이렇게 `nginx.conf` 파일에 작성하고 nginx를 재실행하면 `http://test.domain.com/test/`에서 nuxt로 구축한 웹 어플리케이션이 잘 작동한다!
