---
title: 'Zotero Plugin으로 RAG 기반의 챗봇 Chat with Paper 만들기 (feat. Cursor)'
description: ChatGPT와 Zotero 내부에서 직접 대화할 수 있는 Plugin을 만들어봤다. Cursor와 대화하며 Vanilla RAG로 논문과 대화할 수 있는 chatbot을 간단히 구현한 과정을 소개한다.
slug: llm-zotero-plugin
author: 박하람
category: NLP/LLM
datetime: 2025. 02. 04.
language: Korean
featured: Featured
tags:
  - zotero plugin
  - chat with paper
  - RAG
---

Zotero는 논문의 서지 관리를 위해 애용하고 있는 오픈소스 툴이다. 다양한 기능이 Plugin으로 개발되고 있는데, [지난 포스팅](/blog/zotero-setting)에서 plugin으로 Zotero를 커스터마이징하는 방법에 대해 소개했다 (이 글은 상당히 인기가 많다..!). Plugin을 탐색하면서 Zotero에서 직접 논문과 Chatbot으로 대화할 수 있는 건 없을까 찾아봤는데, 생각보다 내가 원하는 방식으로 구현된 Plugin이 없었다. 그래서 Cursor와 함께 Zotero에서 논문의 내용을 질문할 수 있는 Plugin을 직접 개발해보기로 했다!

### Chatbot과 관련된 기존의 Plugin

ChatGPT와 관련된 Plugin은 다음과 같이 3가지가 존재한다. 그러나, 다음의 이유로 직접 사용하는 데 불편함이 있었다.

- [zotero-chatbot](https://github.com/kazgu/zotero-chatgpt): 플러그인 중 가장 간단한 chatbot 기능을 제공하나, 현재 작동하지 않는다. Preference 설정이나 Pane에서 확인할 수 없다.
- [A.R.I.A. (Aria) - Your AI Research Assistant](https://github.com/lifan0127/ai-research-assistant): 훌륭한 기능을 많이 제공하는 플러그인이지만 한국어로 대화하는 게 불가능하다. 영어 논문에 대해 1차적인 요약이나 해석을 한국어로 얻고 싶어서 chatbot을 사용하고 싶은 것이라 내가 원하는 목적에 맞지 않다고 생각했다.
- [MuiseDestiny/zotero-gpt](https://github.com/MuiseDestiny/zotero-gpt): 3가지 플러그인 중 가장 인기가 많은 플러그인이다. 다양한 기능을 제공하지만, 사용하기 불편하다. Zotero에서 프롬프트 창을 띄우는 방식인데 일단.. README에 적힌 방식으로 해봐도 잘 작동하지 않았다.

내가 원했던 Zotero plugin의 기능은 (1) 오른쪽 패널에서 ChatBot 기능을 제공하고, (2) 개별 논문에 특화된 ChatBot이었다. 간단하게 토이 프로젝트로 구현해 볼 만하다 싶어 내가 원하는 플러그인을 직접 구현해보기로 했다.

### Cursor와 함께 챗봇 구현하기

Zotero plugin은 [zotero-plugin-template](https://github.com/windingwind/zotero-plugin-template)을 기반으로 구현했다. Typescript에 대해 디테일하게 잘 알지는 못하지만, Cursor와 함께 대화하면서 최대한 내가 읽고 이해할 수 있는 코드로 구현하려고 했다. 구현을 위해 고려한 것은 다음과 같다. 

- 사용자가 직접 API Key를 등록하는 형태여야 한다 → Settings에서 API key 등록하는 기능 구현
- 논문을 보면서 오른쪽 Pane에서 직접 대화할 수 있어야 한다 → 논문 클릭 시 오른쪽 Pane에서 챗봇 디자인 및 기능 구현
- 설정한 논문에 대해 디테일하게 질문할 수 있어야 한다 → RAG 기반의 챗봇 구현

화면 구성은 쉬웠지만, RAG 기반으로 챗봇 기능을 구현하는 데 애를 먹었다. 사용한 플러그인 템플릿이 외부 라이브러리를 지원하지 않아...🥹 Langchain이나 chromaDB와 같은 외부 모듈을 사용할 수 없었고, 꽤나 vanilla스러운 RAG 기반으로 구축해야 했다. (개발 후에 다른 플러그인에서 Langchain을 사용한 것을 봤는데 어떻게 사용했는지 구체적으로 살펴봐야된다!)

### Vanilla RAG 적용하기

![rag pipeline](/llm-zotero-plugin/rag-pipeline.png)

대략적인 파이프라인은 위의 그림과 같다: 

1. Zotero API를 사용해 선택한 논문에서 텍스트 추출하기

화면 구현까지는 어렵지 않았는데, 본격적으로 텍스트 추출하는 것부터 애를 먹었다. 처음 아이디어는 Zotero가 해당 논문의 PDF를 저장하는 위치를 찾아서 외부 모듈로 텍스트를 긁어오면 된다고 생각했는데, 우선 외부 모듈이 이 플러그인 템플릿에서 잘 작동하지 않았다. 생각보다 PDF 경로를 찾는 것도 쉽지 않아서 정말 여기서부터 포기할 뻔 했는데, 다행히 [Zotero에서 논문의 text를 저장하는 API](https://www.zotero.org/support/dev/client_coding/javascript_api)를 제공하고 있었다. 덕분에 쉽게 논문의 텍스트를 가져올 수 있었다. 다만, 아쉬운 것은 깔끔하게 텍스트를 가져올 수 있지만 논문서식의 header나 참고문헌이 모조리 포함되어 있다. 추후 더 나은 성능을 위해 텍스트 정제를 고려해볼 법하다.

2. 텍스트를 chunk 단위로 나누기 (chunk size: 1024, overlaps: 200)

텍스트를 임베딩 벡터로 변환하기 위해 chunk로 나누는 작업을 수행했다. 처음엔 chunk size를 500으로 했는데, 1024로 늘리니 비교적 더 문맥이 반영된 응답 결과가 나왔다. 내 목적을 생각하면, 이 논문에 대해 개괄할 수 있는 질문을 하고 싶었다. 따라서 조금 더 문맥을 살리기 위해 chunk size를 길게하고 overlap은 무난한 200으로 설정했다. 

3. `text-embedding-3-large`로 임베딩 및 저장하기

다음은 chunk를 임베딩 모델을 사용해 벡터화된 데이터를 만드는 과정이다. 초기에 `text-embedding-ada-002`로 임베딩했지만, 성능이 매우매우 좋지 않아서 가장 최신인 `text-embedding-3-large`로 변경했다. 임베딩 모델만 바꿔줬는데도 훨씬 좋은 응답결과가 나와서...! 성능이 좋은 임베딩 모델을 사용하는 것이 매우 중요하다.

이렇게 임베딩한 데이터는 보통 ChromaDB와 같은 Vector DB에 저장한다. 그런데 이 템플릿이 외부 라이브러리가 지원되기 않는 제약 때문에 임시 파일을 생성하거나 메모리에 저장하는 방식을 선택할 수밖에 없었다. 임시 파일을 생성하는 것이 Zotero를 끄더라도 임베딩 데이터가 유지되니까 더 나은 방법이라 생각했지만, Zotero에서 임시파일을 저장하는 경로를 인식하기가 어려워서 포기했다 (OS 모듈도 사용이 안됨.. 흑흑).  그래서 사용한 방법은 캐시형태로 메모리에 임베딩 데이터를 저장하는 방법이었다. 이렇게 되면 Zotero 종료시 데이터가 날라가 버리는데, 이후 리펙토링을 할 때 고려해야 할 사항이다. 

4. 사용자의 질문과 관련된 정보를 코사인 유사도 기반으로 retrieval 해오기 

다음 파트는 사용자의 질문과 관련된 정보를 추출해온다. 이 때 코사인 유사도를 사용해서 사용자의 질문과 관련된 정보를 추출해왔다. 이후 다음의 그림과 같이 추출한 정보와 함께 프롬프트를 생성해준다. 프롬프트는 간단히 다음의 코드와 같이 생성해줬다. 

```javascript
const prompt = `Context: ${context}\n\nQuestion: ${question}\n\nAnswer:`;`
```

![prompt](/llm-zotero-plugin/prompt.png)

5. 프롬프트에 해당 내용을 질문과 함께 추가해서 질의 및 응답 생성하기

마지막 단계는 Open AI의 `gpt-4o` 모델을 사용해 질의하고 응답한 결과를 받아온다. 


### 구현 결과 

앞선 단계를 거쳐 구현된 챗봇은 다음과 같다! 왼쪽에서 논문을 읽으면서 오른쪽 패널에서 논문과 대화할 수 있다. 개발한 소스 코드는 [Chat with Paper](https://github.com/givemetarte/chat-with-paper) 깃헙에 모두 공개되어 있고, `.xpi`를 다운로드 받아 직접 Zotero에 설치하면 된다. 사용방법은 GitHub의 README에 작성해놓았다. 

`pre-release`를 공개하기 전에 응답이 상당히 느려서 왜일까 했더니, 매번 메세지를 보낼 때마다 임베딩 벡터를 생성하게 해놓았었다...🙀 처음 질문할 때만 임베딩 벡터를 생성하고 이후는 기존의 벡터를 사용하게 하니 2번째 응답부터는 1초내로 속도가 나온다. 그래도! 성능면에서 개선해야 할 부분이 상당히 많다...🥹

![demo eng](/llm-zotero-plugin/demo-eng.png)


### 더 나은 성능을 위해

다음 번의 release 때는 다음의 사항을 고려하는 것이 필요하다: 

- langchain과 같은 외부 라이브러리 사용할 수 있는 방식으로 변경해보는 게 좋을 것 같다. 다른 플러그인을 보니 외부 모듈을 사용해 개발한 것을 봤는데, 코드를 잘 살펴보는 것이 필요하다. langchain의 다양한 text splitter, 유사도 측정 알고리즘 등을 사용해보면서 성능을 올릴 수 있는 방안을 찾아볼 수 있을 것 같다. 
- 텍스트 전처리도 중요하게 처리되어야 한다. 앞선 그림에서 console에 출력된 프롬프트에 논문의 서지사항과 header와 관련된 부분이 추가되어 있다. 본문과 관련없는 텍스트는 최대한 제외한다면 성능을 높일 수 있을 것이라 생각하지만, 어떻게 할 수 있을지는 잘 모르겠다.
- 내가 구현한 프롬프트는 매우매우 간단한 프롬프트다. 논문 요약이나 기술에 특화된 프롬프트를 찾아서 마지막 응답생성에 사용한다면 더 나은 성능을 가져올 것이라 생각한다. 
- 이외에도 사용자가 Claude와 같은 다른 모델을 사용할 수 있도록 지원해줄 필요가 있다. 더불어 현재 temperature는 0.7로 해놓았지만, 사용자가 직접 설정할 수 있는 기능도 제공하면 좋겠다는 생각도 있다. 

이렇게 직접 개발한 Zotero plugin인 Chat with Paper 구현기에 대해 작성해봤다. 작년 추석기간인 일주일동안 밤새서 만들었다가 이제야 마무리해보지만, 여전히 구현해야 할 기능은 많다!