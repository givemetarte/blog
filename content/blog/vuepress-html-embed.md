---
title: Vuepress에서 마크다운 내부에 html을 embed하기
description: Vuepress의 기본 마크다운 기능에 html을 embed하는 기능은 없다. markdown-it-html5-embed를 사용해 마크다운 내부에 html을 embed하는 방법에 대해 알아보자.
slug: vuepress-html-embed
author: 박하람
category: Web Development
datetime: 2024. 02. 27.
language: Korean
featured: None
tags:
  - vuepress
  - markdown-it-html5-embed
---

Vuepress로 문서를 만드는 중인데, 마크다운 내부에 html을 embed할 수 없었다. 시각화한 파일을 html 파일로 다운로드받은 후, 이걸 마크다운 안에 embed할 생각이었는데 생각보다 embed 방법을 찾는데 시간이 걸렸다. 가장 간단하게 해결할 수 있는 방법은 `markdown-it-html5-embed`를 사용하는 것이다.

### 모듈 설치와 설정

아래와 같이 모듈을 설치한다. 내가 다운로드한 버전은 `1^.0.0`이다.

```bash
npm install markdown-it-html5-embed
```

vuepress에 적용하는 방법은 다음과 같이 `docs/config.js`에 작성하면 된다. markdown의 plugin으로 해당 모듈을 설정한다.

```js
export default {
    ...
    markdown: {
        ...
        plugins: [
            'markdown-it-html5-embed'
        ]
    }
}
```

### 마크다운에서 html embed하기

vuepress의 마크다운이 html을 읽어올 수 있는 경로는 `docs/public`이다. 이 폴더 내부에 html 파일을 저장한다. 불러오는 경로는 다음과 같이 설정하고, 창의 넓이에 맞춰 화면이 나타나게 하기 위해서 `width="100%"`를 설정한다. 높이는 원하는 정도로 설정하면 된다.

```html
<embed src="/docs/file.html" width="100%" height="450px"></embed>
```

잘 설정됐다면 html이 마크다운에서 잘 나온다!
