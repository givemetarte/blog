---
title: Vue3에서 ChatGPT API 호출하기
description: Vue3 환경에서 JavaScript로 ChatGPT API를 호출하는 방법에 대해 알아보자.
slug: vue-chatgpt
author: 박하람
category: Web Development
datetime: 2024. 01. 03.
language: Korean
featured: None
tags:
  - Vue
  - ChatGPT
  - JavaScript
---

ChatGPT에게 특정 데이터 값을 제공한 후에 이와 관련된 데이터 분석 시나리오를 제공할 수 있는지 테스트해봤다. 프론트엔드에서 직접 ChatGPT API를 호출했는데, 생각보다 적절한 결과를 불러오기까지 시간이 꽤 소요됐다. 이번 포스팅은 Vue3 어플리케이션에서 ChatGPT API로 응답 결과를 받아오는 과정을 설명한다. 대부분의 코드는 [openai에서 제공하는 Node.js / Typescript 라이브러리](https://github.com/openai/openai-node)를 참고했다.

### API Key 발급과 모듈 설치

ChatGPT API를 사용하려면, OpenAI에서 API Key를 발급받아야 한다. 발급받은 API Key는 `.env` 파일에 저장한다. Vue 프로젝트에서 모듈은 다음과 같이 설치한다.

```bash
npm install openai
```

ChatGPT API가 호출될 Vue 파일에서 다음과 같이 모듈을 임포트한다.

```js
import OpenAI from 'openai'
```

### API 호출하기

다음은 ChatGPT API를 호출하는 코드다. 자세한 설명은 다음과 같다.

- `apiKey`: `OpenAI`의 `apiKey`에 발급받은 API Key를 넣는다. `.env` 파일에 저장된 API Key는 `${import.meta.env.VITE_OPENAI_API_KEY}`로 불러온다.
- `dangerouslyAllowBrowser`: 처음은 이 파라미터 없이 API 호출을 했는데, 결과가 잘 나오지 않았다. 이 파라미터는 브라우저에서 안전하지 않은 작업을 허용한다.
- `prompt`: API를 호출할 때 넣을 프롬프트다. `${JSON.stringify(entity.value)}` 변수는 특정 주소와 관련된 데이터를 JSON 형식으로 만든 데이터가 담겨있다.
- `response`: 이 변수는 API를 호출하는 코드다. 최소한의 파라미터만 설정했다.

```js
// chatGPT description
const getGPTResponse = async () => {
  try {
    const openai = new OpenAI({
      apiKey: `${import.meta.env.VITE_OPENAI_API_KEY}`,
      dangerouslyAllowBrowser: true,
    })

    const prompt = `${
      entity.value.roadAddr
    }라는 주소와 연결된 데이터에 ${JSON.stringify(
      entity.value
    )}란 정보가 있는데 이 정보를 중심으로 주소를 100자 정도로 설명해줘.`

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-3.5-turbo',
    })
    console.log('chatGPT 결과: ', response.choices[0].message.content)
  } catch (error) {
    console.log('chatGPT: 🚨 에러가 발생했습니다.')
  }
}
```

API가 호출되면 콘솔창에서 결과가 출력된다. 결과는 `response.choices[0].message.content`에 담겨있다. 본인은 ChatGPT PLUS를 사용하고 있는데, API 호출까지 평균적으로 약 1분의 시간이 소요됐다..🥲 ChatGPT API의 속도가 원래 빠르지 않은데다가, 프롬프트에 넣는 데이터의 양도 매우 많아서 호출되기까지 상당한 시간이 걸린다. 프롬프트에 입력된 값이 8,000자를 넘기는 경우 응답은 오지 않는다. 결국 프로젝트에서 ChatGPT API는 사용하지 않았다...ㅎㅎ
