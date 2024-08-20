---
title: Nuxt 3와 Vue에서 .env 파일에 있는 변수 불러오기
description: Nuxt 3와 Vue에서 모듈 설치 없이 가장 간단하게 .env 파일의 변수를 불러오는 방법에 대해 소개한다.
slug: nuxt-env-variable
author: 박하람
category: Web Development
datetime: 2024. 08. 20.
language: Korean
featured: None
tags:
  - Nuxt
  - .env
---

Vue로 개발할 때든, Nuxt로 개발할 때든 `.env` 파일에 변수를 저장해 불러올 때가 있다. 매번 까먹어서 찾아보는데, 복잡하거나 애매하게 될 때가 있어서 기록을 위해 작성한다. [이 github discussion](https://github.com/nuxt/nuxt/discussions/15931)을 보면 .env에서 변수를 불러오기 위한 상당히 많은 방법이 있다. 이 중에서 최대한 간단한 방식으로 Nuxt 3이든 Vue든 모두 작동하는 방식을 설명한다.

### .env 파일 생성하기

원하는 경로에 `.env` 파일을 생성하고, 다음과 같이 작성한다. 변수의 시작은 반드시 `VITE_`로 시작해야 Vue 또는 Nuxt의 내부에서 인식한다.

```
VITE_API_URL=http://localhost:5000
```

### .vue 파일에서 변수 불러오기

[이 github discussion](https://github.com/nuxt/nuxt/discussions/15931)에서 `*.config.js`에서 개별적으로 설정하는 방법도 있지만, 개인적으로 변수명을 수정할 때 config 파일도 같이 수정해야해서 더 간단한 방법을 사용한다. 모듈을 따로 설치하지 않아도 되고, 다음과 같이 `${import.meta.env.VITE_API_URL}` 방식으로 작성해주면 된다. 백틱으로 감싸줘야 하는 것을 잊지말자!

```vue
<script setup>
const submitForm = () => {
    fetch(`${import.meta.env.VITE_API_URL}/submit`, {
        ...
    })
}
</script>
```
