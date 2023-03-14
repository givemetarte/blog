---
title: 도메인의 서브 디렉토리로 Vue Deploy하기
description: Vue 프로젝트를 도메인 단위가 아닌 서브 디렉토리를 발행하는 방법을 알아보자.
slug: vue-deploy-subdirec
author: 박하람
category: Web Development
datetime: 2023. 01. 03.
language: Korean
featured: None
tags:
  - Vue.js
  - Subdirectory
  - Deployment
---

우리 연구실은 서브 도메인 수준이 아닌, 서브 디렉토리 수준에서 도메인을 다는 경우가 많다. 대부분 베타 버전으로 서비스를 런칭하기 때문에,
서브 디렉토리 수준에서 도메인을 달아야 했다. 은근히 하위 경로로 도메인을 다는 자료가 별로 없어서 deploy를 하는 데 애를 먹기도 했다. 다행히 Vue는
production 단계에서 하위 경로를 설정하는 방법을 제공한다.

### vue.config.js 설정하기

도메인 경로가 `test.com/projects/search`라고 할 때, 다음과 같이 `publicPath`를 설정해주면 된다. `production`과 ? 다음에 원하는 하위 경로로 변경하고,`npm run build`를 한다. 생성된 `dist` 폴더의 경로는 `/projects/search/`가 반영된다.

```js
module.exports = defineConfig({
  transpileDependencies: true,
  filenameHashing: true,
  configureWebpack: (config) => {
    config.output.filename = 'js/[name].[hash].js'
    config.output.chunkFilename = 'js/[name].[hash].js'
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/projects/search/' : '/',
})
```

### nginx 설정하기

nginx 설정은 간단하다. `npm run build`로 생성된 `dist` 폴더를 복사하고, `nginx`의 root 경로 안에 `dist` 폴더를 이동한다. 이 때 폴더 경로는 `/home/test/projects/search`가 되어야 한다. `dist` 폴더를 `projects` 내부로 이동한 후 폴더명을 바꾸면 된다.

```nginx
server {
    server_name test.com www.test.com;

    location / {
        root /home/test;
        index index.html;
        try_files $uri $uri/ =404;
    }
}
```
