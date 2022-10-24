---
title: SPARQL 엔드포인트로 뽑은 데이터를 Pandas의 DataFrame으로 표현하기 (feat. SPARQLWrapper)
description: SPARQLWrapper를 사용하여 SPARQL 엔드포인트로부터 가져온 데이터를 DataFrame으로 표현해보자.
slug: python-sparql-endpoint
author: 박하람
category: Knowledge Graph
datetime: 2022. 10. 24.
language: Korean
featured: Featured
tags:
  - sparql endpoint
  - SPARQLWrapper
  - pandas
  - dataframe
---

지식그래프로 구축된 그래프 데이터는 데이터 분석이나 시각화를 위해 테이블 형태로 변환할 때가 많다. 더불어, SPARQL 엔드포인트로 실시간 데이터를 요청하는 것이 어렵기 때문에[^1] 필요한 데이터를 RDF에 넣어 속도를 높이는 방법을 사용하기도 한다. 오늘은 파이썬의 모듈을 사용해서 SPARQL 엔드포인트의 데이터를 판다스 `DataFrame`으로 변환하는 방법을 알아 본다. 다양한 파이썬 모듈을 사용해 봤지만, 인코딩 에러나 CORS 에러를 피해갈 수 있는 `SPARQLWrapper`를 사용한다.

### 모듈 설치하기

아래와 같이 간단하게 설치할 수 있고, 버전은 `2.0.0`을 사용했다. `requirements.txt`를 사용하면, `sparqlwrapper==2.0.0`을 추가하면 된다.

```py
pip install sparqlwrapper
```

### SPARQL 엔드포인트로부터 데이터 가져오기

데이터 변환 과정은 (1) SPARQL 엔드포인트 설정하기, (2) SPARQL 질의문 작성하기, (3) `DataFrame`으로 변환으로 구성된다. SPARQL 엔드포인트로부터 데이터를 가져와 `DataFrame`으로 만드는 과정을 재사용이 가능한 형태의 함수로 만든다.

#### SPARQL 엔드포인트 설정하기

그래프 데이터베이스에서 데이터를 추출하려면, SPARQL 엔드포인트가 필요하다. SPARQL 엔드포인트는 그래프 데이터베이스마다 다르고, 나는 `Virtuoso OpenSource` 6.1버전을 사용한다. `Virtuoso`의 SPARQL 엔드포인트는 `.env` 파일에 담아 두고, `dotenv` 모듈로 불러온다[^2]. `.env` 파일에서 정의한 `SPARQL_ENDPOINT`는 `sparql_endpoint`로 정의된다.

```py
import os
from dotenv import load_dotenv

# load .env
load_dotenv()
sparql_endpoint = os.environ.get("SPARQL_ENDPOINT")
```

#### SPARQL 질의문 작성하기

그래프 데이터베이스에서 데이터를 추출하기 위해서는 `SPARQL`로 질의문을 작성해야 한다. 이 포스팅은 지난 포스팅에서 [공공데이터포털의 데이터세트에 대한 메타데이터를 추출하는 질의문 Q3](/blog/rdflib-tutorial-dcat-2)을 사용한다.

```SPARQL
SELECT DISTINCT ?dataset ?title ?orgName ?issued ?modified ?accessURL
WHERE {
    ?dataset a dcat:Dataset ;
        dct:title ?title ;
        dct:publisher ?orgURI ;
        dct:issued ?issued ;
        dct:modified ?modified ;
        dcat:distribution ?distribution .
    ?orgURI rdfs:label ?orgName .
    ?distribution dcat:accessURL ?accessURL .
} LIMIT 5
```

#### DataFrame으로 변환하는 함수 만들기

`SPARQL` 엔드포인트에서 데이터를 추출해서 `DataFrame`으로 변환하는 `get_sparql_data` 함수는 다음과 같다. `get_sparq_data` 함수를 재사용하기 위해 `sparql_endpoint`와 `sparql_query`를 인풋으로 받는다. 이 함수의 작동 과정은 (1) `endpoint`를 설정하고, (2) 질의문을 설정한 후, (3) JSON 형식으로 데이터를 받아 데이터프레임으로 변환한다. `result` 변수는 JSON의 bindings 안에 쿼리 결과를 저장하고, 저장된 결과는 `json_normalize`를 통해 데이터프레임으로 변환된다.

```py
# sparql endpoint setting & converting data to df
def get_sparql_data(sparql_endpoint, sparql_query):
    # define sparql endpoint
    endpoint = SPARQLWrapper(sparql_endpoint)

    # set query
    endpoint.setQuery(sparql_query)

    # set format
    endpoint.setReturnFormat(JSON)

    # result
    result = endpoint.query().convert()
    return pd.json_normalize(result["results"]["bindings"])
```

#### 최종 함수 만들기

앞서 만든 함수를 사용해 최종적으로 데이터를 추출하는 함수 `make_df`는 다음과 같다. `df`로 추출된 데이터는 각 컬럼의 데이터 스키마까지 모두 추출되므로, 실제 값은 `{컬럼명}.value` 컬럼명으로 표현된다. `columns`는 `df`의 컬럼명 중 `.value`를 포함하는 컬럼명만 추출하여 리스트를 생성한다. `df[columns]`는 `.value`가 포함된 컬럼명만 포함한다. 깔끔한 컬럼명을 위해 `replace`로 `.value`를 삭제하고, 결측값은 `None`으로 표현한다.

```py
def make_df(sparql_endpoint, sparql_query):
  # get data
  df = get_sparql_data(sparql_endpoint, sparql_query)

  # add only value columns
  columns = [n for n in df.columns if n.find(".value") != -1]
  df = df[columns]

  # delete "value" in column names
  df = df.rename(columns=lambda col: col.replace(".value", ""))
  df = df.fillna(None)

  return df
```

### 마지막으로

`SPARQLWrapper` 외에 `sparql_dataframe` 모듈도 있지만, 둘 다 사용해 본 결과 `SPARQLWrapper`가 더 광범위하게 사용되고 있는 만큼, 인코딩이나 SPARQL 엔드포인트[^3]에 관계 없이 안정적으로 돌아갔다. `JSON`으로 추출한 다음 데이터프레임으로 변환하는 방식이 다소 귀찮지만, 프론트와 통신할 때 `JSON`으로 변환할 필요 없이 그대로 사용할 수 있기도 하고 제일 안정적으로 데이터가 추출된다.

마지막으로 `SPARQL` 엔드포인트의 `CORS` 에러에 주의해야 한다. 만약 엔드포인트의 주소가 `localhost:9999/blazegraph/sparql`과 같이 로컬에서 실행되는 것이라면, `Django`나 `FastAPI`에서 `CORS` 에러가 생길 확률이 높다. 이 경우, 가장 쉽게 해결할 수 있는 방법은 웹 서버 단에서 주소를 우회하는 방법을 사용하면 된다[^4].

[^1]: 몇 억건 이상의 데이터를 SPARQL 엔드포인트로 실시간 통신하려고 하면 터진다.. (알고 싶지 않았다...🥲) 물론, 하나의 그래프 데이터베이스에 몇 억건의 데이터를 넣는 무식한 방법을 사용하긴 했지만, 지식그래프로 표현한 데이터는 처리해야 하는 데이터의 양이 최소 3배 이상이 되기 때문에 일반적인 데이터베이스보다 속도가 느리다.
[^2]: SPARQL 엔드포인트는 보안상 개방하지 않는 것이 안전하다.
[^3]: 버투소, blazegraph 등의 벤더에 상관 없이 잘 돌아간다는 의미다.
[^4]: 주소를 우회하는 방법은 다음 포스팅으로...🥹
