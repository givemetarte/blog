---
title: MySQL의 Full text index 설정 (ngram parser)과 쿼리 최적화 (30초에서 1초로 줄이기)
description: MySQL에서 데이터 추출 시간을 줄이기 위해 Full text index를 설정하고 쿼리를 최적화한 방법을 설명한다.
slug: mysql-full-text-index
author: 박하람
category: MySQL
datetime: 2024. 12. 19.
language: Korean
featured: None
tags:
  - MySQL
  - full_text_index
  - ngram_token_size
---

MySQL에서 데이터를 가져오는 API를 만드는데, 데이터 호출 시간이 상당히 오래 걸렸다. API 생성에 필요한 MySQL 구문은 다음과 같다. 특정 키워드가 포함된 결과물의 전체 개수를 계산한 다음, Pagination을 위해 일부 행만 제공하는 방식이다. 다음과 같이 도로명주소 컬럼에 '콩쥐팥쥐'가 포함된 값을 추출하는 질의문을 사용했더니[^1] 100줄을 가져오는 데 체감 30초 정도가 소요됐다. 

### Full text index 설정

```sql
SELECT COUNT(*) AS COUNT FROM rna_addr WHERE 도로명주소 LIKE '%콩쥐팥쥐%';
SELECT * FROM rna_addr WHERE 도로명주소 LIKE %s LIMIT %s OFFSET %s;
```

그래서 선택한 방법은 도로명주소 컬럼에 full text index를 설정해주고, 얼마나 검색 속도가 빠른지 살펴봤다. 그런데 이상하게도 이전 질의문으로 376개의 결과가 나왔는데, full text index를 사용해 질의한 결과는 0개가 나왔다. 

```sql
ALTER TABLE rna_addr ADD FULLTEXT INDEX IDX_RNA (도로명주소);
SELECT COUNT() AS COUNT FROM rna_addr WHERE MATCH(도로명주소) AGAINST('콩쥐팥쥐' IN NATURAL LANGUAGE MODE);
```

### Ngram 파서로 변경

기본적으로 full text index를 설정하면 최소 단어 길이는 4로 설정되어 있고, 공백과 특수문자를 기준으로 단어를 분리해 토큰화한다. 예를 들어, '전북특별자치도 전주시 콩쥐팥쥐로 5'라는 도로명주소는 `['전북특별자치도','전주시','콩쥐팥쥐로','5']`로 토큰화된다. '콩쥐팥쥐'가 아닌 '콩쥐팥쥐로'로 생성된 토큰으로 인덱스가 생성되기 때문에 검색결과가 0이 나왔던 것이다. 

그래서 연속된 글자를 기준으로 토큰화하는 방법은 없을까 찾아보다가 [이 블로그 글](https://gngsn.tistory.com/163)에서 Ngram 방식으로 인덱스를 생성할 수 있다는 것을 알게 됐다. Ngram 파서는 연속된 글자를 기준으로 토큰화하고, 토큰 사이즈에 따라 공백을 무시한 채 토큰화를 한다. 예를 들어, 토큰 사이즈 n이 2라면, '전북특별자치도 전주시 콩쥐팥쥐로 5'는 `['전북','북특','특별','별자',...]`와 같은 방식으로 토큰화된다. ngram 파서로 인덱스를 생성한 방식은 다음과 같다. 

```sql
ALTER TABLE rna_addr ADD FULLTEXT INDEX IDX_RNA (도로명주소) WITH PARSER ngram;
```

```conf
# mysql.cnf
ngram_token_size=2
```
위와 같이 conf 파일에서 ngram으로 토큰을 나누는 글자의 개수를 2로 설정해준다. 이렇게 하니 '콩쥐팥쥐'를 검색했을 때 376개의 결과가 잘 나왔다! 376개의 결과는 '콩쥐팥쥐로'를 포함하고 있어 기본 파서로 검색이 되지 않았던 것이 연속된 글자를 기준으로 토큰화하니 '콩쥐팥쥐'를 검색해도 잘 나온 것이다. 그러나 인덱스 설정으로 데이터 추출시간은 드라마틱하게 감소하지 않았다🥹. 약 30초에서 대략 20초로 감소했고, 데이터 쿼리 최적화를 시도해봤다. 

### MySQL 쿼리 최적화

이전 코드의 데이터 추출방법은 다음과 같다. keyword에 맞는 전체 행을 추출한 다음, 다시 그 키워드가 포함된 특정 행을 추출하는 방법이다. 이와 같은 방식은 (1) 전체 행 추출, (2) 특정 행 추출이란 질의를 2번 날리기 때문에 추출 속도가 느리다고 판단했다. 

```python
def get_rna_addr_by_keyword(keyword: str, page: int = 1, limit: int = 0):
    start_row = (page - 1) * limit
    all_data = database.query_get(
            """
            SELECT COUNT(*) AS COUNT FROM rna_addr WHERE MATCH(도로명주소) AGAINST(%s IN NATURAL LANGUAGE MODE);
            """,
            (f"{keyword}"),
        )
    total_count = all_data[0]["COUNT"]

    if start_row < total_count:
        data = database.query_get(
            """
            SELECT * FROM rna_addr WHERE 도로명주소 LIKE %s LIMIT %s OFFSET %s;
            """,
            (f"%{keyword}%", limit, start_row),
        )
    ...
    # data를 json 형태의 response로 변환
    return response
```

그래서 다음과 같이 한번에 전체 행과 특정 행 결과를 가져올 수 있는 방법으로 MySQL 구문을 수정했다. 한번에 검색하기 위해 서브 쿼리를 사용했고, 특정 행 결과를 가져오는 data와 전체 행 개수를 가져오는 counts를 `CROSS JOIN`했다. 전체 행 개수가 모든 행마다 추가되어 조금은 비효율적일 수 있다고 생각했지만, 검색 결과는 단 1초로 감소했다! 

```python
def get_rna_addr_by_keyword(keyword: str, page: int = 1, limit: int = 0):
    start_row = (page - 1) * limit
    data = database.query_get(
        """
        SELECT data.*, counts.total_count 
        FROM (
        SELECT * FROM rna_addr WHERE MATCH(도로명주소) AGAINST(%s IN NATURAL LANGUAGE MODE) LIMIT %s OFFSET %s
        ) as data 
        CROSS JOIN (
            SELECT COUNT(*) as total_count FROM rna_addr WHERE MATCH(도로명주소) AGAINST(%s IN NATURAL LANGUAGE MODE)
        ) as counts;
        """,
        (f"{keyword}", limit, start_row, f"{keyword}"),
    )
```

[^1]: 우리나라의 도로명주소에 '콩쥐팥쥐'가 포함된 주소가 있다. 전북특별자치도 김제시에는 '콩쥐팥쥐로'라는 도로명이 존재한다. (왜 콩쥐팥쥐로일지는 궁금합니다..ㅎ)