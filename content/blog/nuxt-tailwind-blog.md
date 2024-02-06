---
title: Nuxt와 Tailwind CSS로 블로그 만들기
description: 디자인이 비슷한 jekyll에서 벗어나 디자인 자유도가 높은 Tailwind CSS와 Nuxt로 더 이쁜 블로그를 만들어보자.
slug: nuxt-tailwind-blog
author: 박하람
category: Web Development
datetime: 2021. 12. 23.
language: Korean
featured: None
tags:
  - nuxt
  - tailwind
  - blog
  - netlify
---

흔하고 이쁘지 않은 Jekyll 블로그에서 벗어나고 싶다면, 당장 nuxt와 tailwind css로 블로그를 만들자. nuxt의 content 모듈은 블로그와 같은 정적 페이지를 만들기 쉽고, tailwind css는 쉬운 방식으로 홈페이지의 디자인을 아름답게 만들 수 있다. 덤으로 nuxt 블로그를 netlify로 호스팅하고, 나만의 도메인을 다는 일련의 과정까지 함께 알아보자. 해당 포스트는 자세한 튜토리얼 보단 블로그를 만드는 workflow를 소개한다.

### Nuxt 구조 이해하기

nuxt는 일반적으로 vue.js 어플리케이션을 만드는 프레임워크다. CLI로 쉽게 프로젝트를 생성할 수 있고, 디렉토리 기반으로 자동 라우팅을 생성한다. 나는 처음 nuxt를 다루어 디렉토리 구조를 이해하는데 쉽지 않았다. 그러나 nuxt의 문서화가 굉장히 훌륭하고, 수많은 블로그 게시글과 stackoverflow와 함께라면 nuxt 프로젝트를 생성하기는 어렵지 않다. nuxt 구조에 대한 상세한 설명은 [nuxt 공식 문서](https://nuxtjs.org/docs/get-started/directory-structure)에서 확인할 수 있다. 아래는 내가 선택한 nuxt 초기 설정이다.

![Tailwind 지원 프레임워크](/nuxt-tailwind-blog/nuxt-installation.png)

### Nuxt의 Content 모듈

nuxt의 `Content` 모듈은 headless CMS 기반의 깃 파일로, 정적 페이지를 만드는데 필요한 기능을 제공한다. nuxt 생태계가 훌륭한 까닭은 문서화가 잘 되어 있기 때문이다. 마크다운으로 컨텐츠를 작성하고, 데이터를 fetch하는 방법은 [공식 문서](https://content.nuxtjs.org/)에 잘 나와있다. 아래 튜토리얼을 따라하면, 블로그에 필요한 기본적인 요소들을 생성할 수 있다.

- [Nuxt Content로 블로그 만들기](https://nuxtjs.org/tutorials/creating-blog-with-nuxt-content/)
- [Nuxt Content로 Sitemap 생성하기](https://redfern.dev/articles/adding-a-sitemap-using-nuxt-content/)
- [Nuxt Content로 소셜 미디어와 SEO 메타데이터 추가하기](https://redfern.dev/articles/adding-social-media-seo-meta-data-using-nuxt-content/)

### Tailwind CSS로 디자인하기

Tailwind CSS는 2021년 CSS 프레임워크 중 선호도 1위를 차지했다[^1]. 그만큼 tailwind는 (대규모) 프로젝트에 핫하게 사용되고 있는 CSS 프레임워크다. 미리 정의된 CSS 클래스를 사용해 쉽게 디자인할 수 있다는 점이 큰 장점이다. nuxt는 프로젝트를 설치할 때 Tailwind CSS를 UI framework로 지원한다. 따라서 nuxt를 설치할 때 tailwind를 선택했다면 별도의 설치가 필요없다. Tailwind CSS로 프로젝트를 커스터마이징하는 방법은 [해당 포스팅](https://www.blog.penielcho.com/tailwind-on-nuxt)을 참고하자. 나의 블로그 디자인은 [🧑🏻‍💻 Peniel의 블로그](https://www.blog.penielcho.com)를 많이 참고했다.

### Netlify로 호스팅하기

[Netlify](https://www.netlify.com/)는 무료로 정적 페이지를 호스팅하는 서비스를 제공한다. Nuxt 프로젝트를 깃헙에 올린 후, Netlify로 호스팅할 깃헙 레포지토리를 선택하면 된다. 수정사항을 Github에 업로드하면, Netlify가 자동으로 레포의 수정사항을 반영하여 새롭게 프로젝트를 deploy한다. 내 도메인으로 연결할 경우, 아래와 같이 Custom domains을 설정한다. Default subdomain 이름을 간단히 만들면 `CNAME`으로 도메인과 연결하기 편하다.

![Netlify custom domain](/nuxt-tailwind-blog/netlify-domains.png)

Nuxt와 Tailwind CSS로 블로그를 만들기까지 대략 일주일의 시간이 걸렸다. 드디어 예쁘지 않은 Jekyll 블로그에서 예쁜 Nuxt 블로그로 탈출했다! 블로그 테마를 아름답게 만든 Peniel에게 큰 감사를 표한다 🙇🏻‍♀️ 2022년은 새로운 블로그와 함께 공부 내공을 쌓아가는 한 해 되기를 바란다.

<div class="note">

👀 블로그 코드 보기: [Github](https://github.com/givemetarte/blog)

</div>

[^1]: [CSS 2021: CSS Framework](https://2021.stateofcss.com/ko-KR/technologies/css-frameworks)
