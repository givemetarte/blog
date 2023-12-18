---
title: Mixed Content The page at 'xxx' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'yyy'. This request has been blocked; the content must be served over HTTPS 에러 해결하기
description: HTTP와 HTTPS가 함께 제공될 때 뜨는 Mixed Content 에러를 해결해보자.
slug: mixed-content-error
author: 박하람
category: Web Development
datetime: 2023. 12. 18.
language: Korean
featured: None
tags:
  - Mixed Content
  - HTTPS
  - HTTP
  - Vue3
---

Vue3에서 API를 불러오는 코드가 있는데, 계속해서 `Mixed Content` 에러가 떴다. 빨리 deploy를 해야 하는 상황이라 마음이 급한데, 갑자기 이런 에러가 생겨서 순간 당황했다. 이 포스팅은 `Mixed Content` 에러를 해결하는 방법에 대해 알아본다.

### 에러 코드

내가 실행했던 코드는 다음과 같다. `getAddrDetail`은 axios를 사용해 `http://127.0.0.1/api/db/${code}`로 요청된 데이터를 가져온다. 그런데 데이터를 가져오는 과정에서 계속 Mixed Content 에러가 나타났다. 해당 코드가 실행되는 페이지는 `https://test.domain.com`에서 실행되지만, api 요청은 `http://127.0.0.1/api/db/${code}`에서 가져온다. 즉, HTTPS와 HTTP가 동시에 사용되고 있기 때문에 Mixed Content 에러가 생긴다.

```js
const getAddrDetail = async () => {
  try {
    code = createCode(selectedAddr.value)
    store.commit('resetAddrDetail')
    const response = await axios.get(`http://127.0.0.1/api/db/${code}`)
    addrDetail.value = response.data
    store.commit('setAddrDetail', addrDetail)
  } catch (error) {
    console.log('🚨 에러가 발생했습니다.')
    console.error()
  }
}
```

### 방법1: HTTP → HTTPS로 바꾸기

이 에러가 나오는 이유는 HTTP와 HTTPS가 모두 사용되고 있기 때문이다. 가장 정석적인 해결방법은 HTTP를 HTTPS로 바꿔주면 된다. 내가 사용하는 방법은 `nginx`에서 `proxy_pass`로 HTTPS 인증을 받은 도메인을 부여해준다.

```nginx
server {
    ...

    location /api/ {
        proxy_pass http://xxx.xxx.xx.xx:5001/api/;
    }
}
```

그 다음은 API를 불러오는 경로를 수정한다. nginx에서 해당 경로는 `https://${import.meta.env.VITE_KEY_DOMAIN}/api/db/${code}`로 수정되었으므로, https의 경로로 api에 요청을 보내는 것이 가능해졌다. 참고로, `${import.meta.env.VITE_KEY_DOMAIN}`은 `.env` 파일에 있는 VITE_KEY_DOMAIN 값 (= test.domain.com)을 불러오는 코드다.

```js
const getAddrDetail = async () => {
  try {
    code = createCode(selectedAddr.value)
    store.commit('resetAddrDetail')
    const response = await axios.get(
      `https://${import.meta.env.VITE_KEY_DOMAIN}/api/db/${code}`
    )
    addrDetail.value = response.data
    store.commit('setAddrDetail', addrDetail)
  } catch (error) {
    console.log('🚨 에러가 발생했습니다.')
    console.error()
  }
}
```

### 방법2: meta 태그 달기

나의 경우는 위처럼 동시에 https로 데이터를 주고 받는 데도 계속해서 Mixed Content 에러가 생겼다. 구글링한 결과, [스택오버플로우](https://stackoverflow.com/questions/35178135/how-to-fix-insecure-content-was-loaded-over-https-but-requested-an-insecure-re)에서 다음과 같은 meta 태그를 작성하라고 했다. Vue3는 가장 상단 경로에 있는 `index.html`의 `head` 안에 다음의 코드를 작성한다.

```html
<meta
  http-equiv="Content-Security-Policy"
  content="upgrade-insecure-requests"
/>
```

방법2까지 하니 비로소 Mixed Content 에러가 해결됐다. 도메인을 달고 deploy할 때 종종 Mixed Content 에러가 발생한다. 가장 마지막 단계에서 이런 에러가 생기면, 다 된 밥에 재뿌린 것 같은 느낌이 드는데... 평정심을 갖고 얼른 해결하면 된다!
