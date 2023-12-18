---
title: 판다스의 explode 함수로 하나의 셀에 리스트로 입력된 값을 여러 행의 단일 값으로 바꾸기
description: 특정 컬럼의 셀에 리스트로 구성된 값이 있는데, 리스트의 값을 쪼개 여러 행으로 표현해보자. 간단히 explode 함수를 적용해주면 된다.
slug: pandas-explode
author: 박하람
category: Python
datetime: 2023. 04. 07.
language: Korean
featured: None
tags:
  - pandas
  - explode
---

오랜만에 판다스를 활용하여 데이터를 정제하는 작업을 했다. 공공데이터포털의 국가중점데이터를 크롤링하는 작업이었는데, 데이터를 정제하는 과정에서 금방 코드가 떠오르지 않는 부분이 있었다.
다음 그림의 `PK 목록` 컬럼은 해당 카탈로그에 포함된 데이터세트의 PK 목록을 리스트 형태로 갖고 있다.

<img src="/pandas-explode/df1.png" class="img"/>

그런데 다음의 데이터프레임과 `목록키`에 담긴 PK 값을 기준으로 두 데이터프레임을 병합하고 싶어서 `PK 목록`에 있는 리스트 형태를 한줄씩 하나의 셀로 표현하고 싶었다.

<img src="/pandas-explode/df2.png" class="img"/>

처음에 `iterrow`로 불러서 하나씩 for문을 돌리는 방법을 생각해봤지만, 굉장히 비효율적인 것 같아서 ChatGPT와 [연구실의 송시리](https://github.com/shinysong)의 도움을 받아 간단히 해결했다.

### explode 함수 사용하기

코드는 다음의 순서대로 진행된다.

- `read_csv`로 CSV 파일을 불러온다.
- `PK 목록`의 리스트는 텍스트 형태로 표현되므로, `eval`을 사용하여 리스트 형태로 바꿔준다.
- `PK 목록` 컬럼에 `explode` 함수를 적용하고, 인덱스를 다시 생성해준다.

```py
df = pd.read_csv('../data/crawled/국가중점데이터-데이터세트-목록.csv', encoding='utf-8')
df['PK 목록'] = df['PK 목록'].apply(lambda x: eval(x))
df = df.explode('PK 목록').reset_index(drop=True)
df.head()
```

코드를 실행한 결과는 다음과 같다. `PK 목록`의 리스트에 담긴 값이 모두 하나의 행으로 표현되고, 나머지 컬럼의 값은 중복되어 작성된다.

<img src="/pandas-explode/final-df.png" class="img"/>

이렇게 데이터가 PK 기준으로 생성되면, 다른 데이터프레임과 병합할 수 있다. 다음과 같이 두 개의 데이터프레임을 `목록키` 기준으로 간단히 병합할 수 있다.

<img src="/pandas-explode/merged-df.png" class="img"/>
