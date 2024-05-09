---
title: Nuxt에서 Latex 추가하기 (중복 렌더링 오류 해결하기)
description: Nuxt content에 Latex를 추가하고, 중복으로 렌더링되는 오류를 해결하는 방법을 소개한다.
slug: nuxt-add-latex
author: 박하람
category: Web Development
datetime: 2024. 05. 09.
language: Korean
featured: None
tags:
  - Nuxt
  - Latex
---

현재 이 블로그는 Nuxt와 Nuxt content를 기반으로 만들어졌다. 지금 Nuxt content의 `1.15.1` 버전은 Latex를 내장 기능을 지원하고 있지 않다. 그러나, 모듈을 추가해 Latex를 사용할 수 있다. 오늘 포스팅은 Nuxt content 버전 1에서 Latex를 사용하는 방법과 중복으로 렌더링 되는 문제를 해결하는 방법에 대해 소개한다.

### Latex 적용하기

Nuxt content 내부에 Latex를 적용하는 방법은 [이 깃헙 이슈](https://github.com/nuxt/content/issues/1774)를 참고했다. 다음과 같이 Latex를 지원하는 모듈을 설치한다.

```bash
npm install remark-math, rehype-katex
```

설치한 다음은 `nuxt.config.js`에서 다음과 같이 모듈을 적용한다. `markdown` 내부에 `remark-math`와 `rehype-katex`를 추가한다.

```js
content: {
    markdown: {
      remarkPlugins: ['remark-math'],
      rehypePlugins: ['rehype-katex']
    },
    ...
  },
```

잘 적용됐다면 다음과 같이 Latex를 사용할 수 있다!

$$
y=x^2+3x+5
$$

### 중복 렌더링 문제 해결하기

그런데 자꾸 Latex가 렌더링 될 때, 다음과 같이 중복으로 렌더링되는 문제가 나타났다. Latex로 렌더링된 수식과 마크다운으로 쓴 수식이 모두 표시됐다. 이 경우도 [이 깃헙 이슈](https://github.com/KaTeX/KaTeX/discussions/2806)를 보고 해결했다.

![repeat rendering](/nuxt-add-latex/repeat-rendering.png)

`katex.min.css` 파일을 직접 불러오는 방식으로 해결했다. `layouts/default.vue`에 다음과 같이 직접 css 파일을 불러오면 된다.

```vue
<style>
@import url('katex/dist/katex.min.css');
</style>
```

간단하게 Latex를 적용하고 중복 렌더링 문제까지 해결!
