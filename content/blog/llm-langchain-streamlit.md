---
title: LangChain으로 ChatGPT를 이용해 논문 초록 생성하기 (feat. Streamlit)
description: LangChain으로 ChatGPT를 사용해서 논문의 초록을 생성해보자. 추가적으로 ChatGPT의 결과를 Streamlit으로 이쁘게 나타내보자.
slug: llm-langchain-streamlit
author: 박하람
category: LLM
datetime: 2024. 01. 11.
language: Korean
featured: None
tags:
  - LangChain
  - ChatGPT
  - Streamlit
---

LangChain은 언어모델에 의해 개발되는 어플리케이션을 위한 프레임워크로, 언어모델을 이용한 어플리케이션 개발에 광범위하게 사용되고 있다. 다방면에서 LangChain이 사용되고 있는 만큼, 간단하게 LangChain을 사용할 수 있는 방법에 대해 알아보았다. 현재 LangChaing은 활발히 업데이트되고 있어 해당 코드가 계속 변할 수 있다. 이번 포스팅은 LangChain (2024년 1월 11일 기준)을 기반으로 ChatGPT를 이용해 논문의 초록을 생성하는 간단한 어플리케이션을 만드는 방법을 소개한다.

### 프로젝트 경로 설정

프로젝트를 실행할 디렉토리를 설정한다. 본인은 `langchain-test`에서 프로젝트를 실행하고, 다음과 같은 파일을 생성한다.

```
langchain-test
├─ .env
├─ README.md
├─ main.py
└─ requirements.txt
```

### 가상환경 설정

논문 초록 생성기를 위한 파이썬 가상환경을 설정한다. 가상환경에서 사용할 파이썬 라이브러리는 다음과 같다. `requirements.txt`라는 이름의 파일을 생성하고, 다음의 라이브러리를 입력한다.

```
openai==1.7.0
python-dotenv==1.0.0
langchain-openai==0.0.2
streamlit==1.29.0
```

`requirements.txt`가 생성되었다면, 본인이 원하는 디렉토리에서 다음과 같이 가상환경을 생성한다. 가상환경이 생성되면 가장 상단의 디렉토리에서 `env`라는 폴더가 생성된다.

```bash
python3 -m venv env  # env라는 가상환경 설치
source env/bin/activate  # 가상환경 실행
pip3 install -r requirements.txt  # requirements.txt에 있는 모듈 설치
```

### `.env` 파일 생성

ChatGPT를 불러오려면 api key가 필요하다. OpenAI에서 api key를 발급받고, `.env` 파일에 다음과 같이 api key를 작성한다. `main.py`에서 `.env`에 있는 `OPENAI_API_KEY`를 불러와 사용할 것이다.

```
OPENAI_API_KEY=********************
```

### `main.py`에서 코드 작성하기

전반적인 과정은 다음과 같다.

1. `.env`에서 api key를 불러온다.
2. LangChain에서 언어모델을 선택한다. 본 포스팅은 OpenAI의 언어모델을 사용한다.
3. 프롬프트 출력을 이쁘게 하는 파서를 사용한다.
4. Streamlit을 사용해 웹 페이지에서 이쁘게 출력한다.

아래의 코드는 [LangChain](https://python.langchain.com/docs/get_started/quickstart)과 [Streamlit](https://docs.streamlit.io/library/api-reference)의 공식문서에서 가져왔다.

- `openai_api_key`는 `.env` 파일에서 가져온 api key가 저장된다.
- st로 시작되는 코드는 streamlit을 이용한 코드다. `st.title`은 제목을 작성하고, `st.text_input`은 사용자가 논문의 주제를 입력할 input box를 생성한다. 사용자에게 입력받은 값은 `content` 변수에 저장된다.
- `llm`은 사용할 언어모델을 정의하고, `prompt` 변수는 system과 user의 역할을 상세히 지정한다. system은 월드 클래스 수준의 논문 작성자라고 선언했다.
- `output_parser`는 결과가 더 이쁘게 출력되게 한다.
- `chain`은 언어모델(`llm`)과 프롬프트(`prompt`), 파서(`output_parser`)를 연결한다.
- 해당 버튼(`st.button`)이 눌릴 때, `chain`에서 ChatGPT에 결과를 수행하도록 한다. `result`가 가져올 동안 `st.spinner`가 작동하도록 설정한다. `result`는 `st.write`로 본문에 작성되도록 한다.

```py
import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import streamlit as st

openai_api_key = os.getenv("OPENAI_API_KEY")

# streamlit으로 제목과 input box 생성
st.title("논문 초록 작성기")
content = st.text_input("논문의 초록을 작성할 주제와 간단한 내용을 입력해주세요.")

# 언어모델 불러오기
llm = ChatOpenAI(openai_api_key=openai_api_key)
prompt = ChatPromptTemplate.from_messages(
    [("system", "You are a world class paper writer."), ("user", "{input}")]
)
output_parser = StrOutputParser()
chain = prompt | llm | output_parser

# 버튼 클릭시 논문 초록 생성
if st.button("논문 초록 작성하기"):
    with st.spinner("초록 작성 중입니다..."):
        result = chain.invoke({"input": f"{content}에 대한 논문의 초록을 작성해줘."})
        st.write(result)

```

아주 간략하게 '주소가 포함된 데이터세트의 분석'에 대한 논문의 초록을 써달라고 했을 때, 다음과 같은 결과가 나온다.

![result](/llm-langchain-streamlit/result.png)

간단한 수준에서 LangChain으로 논문 초록 작성기를 만들어봤다. LangChain은 다양한 언어모델을 지원하기 때문에, LLaMA 2나 HuggingFace에 있는 다양한 모델로 바꿔서 사용할 수 있다.
언어모델로 개발하기 쉬운 세상이 도래했다...!
