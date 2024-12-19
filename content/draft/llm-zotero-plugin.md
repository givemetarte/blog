---
title: '[Chat with Paper] Vanilla RAG로 논문과 대화하는 Zotero Plugin 만들기 (feat. Cursor)'
description: ChatGPT와 Zotero 내부에서 직접 대화할 수 있는 Plugin을 만들어봤다. Cursor와 대화하며 Vanilla RAG로 논문과 대화할 수 있는 chatbot을 간단히 구현한 과정을 소개한다.
slug: llm-zotero-plugin
author: 박하람
category: NLP/LLM
datetime: 2024. 09. 16.
language: Korean
featured: None
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

### Cursor와 함께 Plugin 구현하기

- javascript 어느정도 할줄 앎
- zotero-plugin-template 기반으로 수정
- readme 따라 수정 --> chat with paper란 이름으로 개발
- 내 깃헙에서 코드가 모두 공개 (development branch로 생성)

### Preference 설정

- 사진 추가
- 간단히 chatgpt의 api key 삽입 후 설정
- 추후 api key 암호화해서 저장, pref에 점으로 보이게 구현

### Pane 설정

- 오른쪽에 chatbot 화면 구성
- 가장 아래 input, message에 대한 화면 구성

### Vanilla RAG 적용하기

- 화면은 구성됐는데, 내부 로직의 문제...
- 원하는 건 왼쪽에 열린 논문을 기반으로 오른쪽 chatbot이 잘 요약하거나 대화할 수 있는 것
- (1) keyword 검색 방식, (2) RAG 방식 --> 이중 keyword는 언어에 따라 다른 로직 사용해야 함, RAG로 결정
- 과정:
  - (1) 열려있는 pdf에서 text 추출
  - (2) chunk로 나눔
  - (3) embedding
  - (4) vector db에 저장
  - (5) question에 따라 retrieval 구현
  - (6) 응답결과 제공
- plugin에서 langching과 같은 외부 라이브러리 사용 어려움
- vanilla RAG 로 개발 --> 근데 성능이 구림 ... 속도도 엄청 느림...

### Next To Do

- langchain과 같은 외부 라이브러리 사용할 수 있는 방식으로 변경
- 파이썬 백엔드로 쓰는 통신을 구현?
- chatgpt의 모델 변경할 수 있는 ui 구현, temperature도 변경할 수 있게.
- claude와 같이 다른 llm도 지원
