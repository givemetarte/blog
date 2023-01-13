---
title: 구글 SEO를 위한 Schema.org 마크업 추가하기
description: 검색 엔진 최적화를 위해 구글이 사용하는 마크업 언어 schema.org를 사용해보자. JSON-LD 형식으로 웹페이지의 데이터를 쉽게 표현해보자.
slug: seo-schema-jsonld
author: 박하람
category: Web Development
datetime: 2021. 12. 30.
language: Korean
featured: Featured
tags:
  - schema.org
  - nuxt
  - jsonld
  - SEO
  - 검색엔진최적화
---

내 블로그가 구글의 검색 결과에 잘 노출되게 하려면, 검색 엔진 최적화(SEO, Search Engine Optimization)를 하는 것이 필수다. 구글이 만든 schema.org 마크업 언어를 사용해 내 웹페이지의 데이터를 표현해보자. Nuxt는 Vue 컴포넌트에 `JSON-LD` 형식으로 메타 태그를 표현할 수 있는 플러그인을 제공한다. 환경설정과 적용방법은 [여기](https://thenextbit.de/en/blog/nuxtjs-seo)를 참고했다.

### 환경설정

프로젝트에 [nuxt-jsonld](https://www.npmjs.com/package/nuxt-jsonld) 플러그인을 설치한다. `npm` 또는 `yarn` 중 하나를 선택하여 설치하면 된다.

```bash

$ npm install nuxt-jsonld
$ yarn add nuxt-jsonld
```

`plugins` 폴더를 생성하고, 그 안에 `jsonld.js` 파일을 만든다. `nuxt.config.js` 파일의 `plugins` 항목에 해당 모듈을 추가하는 것도 잊지말자.

```js
// ~/plugins/jsonld.js

import Vue from 'vue'
import NuxtJsonld from 'nuxt-jsonld'

Vue.use(NuxtJsonld)
```

```javascript

// nuxt.config.js

plugins: [
  '@/plugins/jsonld.js',
],

```

### JSON-LD로 표현하기

[schema.org](https://schema.org)는 여러 유형의 데이터를 표현할 수 있다. 블로그 포스팅은 [BlogPosting](https://schema.org/BlogPosting) 유형을 사용할 수 있다. 그 외에도 [WebPage](https://schema.org/WebPage), [NewsArticle](https://schema.org/NewsArticle), [SocialMediaPosting](https://schema.org/SocialMediaPosting) 등의 유형을 제공하므로 자신의 콘텐츠에 맞는 유형을 선택하면 된다[^1]. 더 다양한 속성을 사용하고 싶다면, 위의 유형을 클릭하여 원하는 속성을 추가할 수 있다.

```html
<!-- ~/pages/_slug.vue -->

<script>
  jsonld() {
        return {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://www.blog.harampark.com/...',
          },
          headline: '...',
          description: '...',
          image: '...',
          author: {
            '@type': 'Person',
            name: 'Haram Park',
            email: '...',
            url: '...',
            nationality: {
              '@type': 'Country',
              name: 'South Korea'
            }
          },
          datePublished: '...',
          inLanguage: 'ko',
          keywords: '...'
        }
      },
</script>
```

## 적용 결과

[Google의 Rich Result Test](https://search.google.com/test/rich-results)로 웹페이지의 정보가 잘 표현되었는지 확인해보자. 블로그 게시글의 URL을 입력하면 Googlebot의 게시글 탐지 결과를 확인할 수 있다. 크롬의 개발자 도구로 보면 게시글의 `<head>`에 `json-ld` 정보가 달려있는 것을 확인할 수 있다.

![rich result test](/seo-schema-jsonld/rich-results-test.png)

[^1]: 그 외의 유형은 [여기](https://schema.org/docs/full.html)에서 볼 수 있다.
