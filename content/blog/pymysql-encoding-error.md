---
title: pymysql.err.ProgrammingError 한글 인코딩 문제 해결하기
description: pymysql로 MySQL에 접속하고, 키워드를 검색해 데이터를 가져오는 과정에서 한글 인코딩 에러가 발생했다. pymysql로 데이터베이스에 접속할 때 인코딩 에러가 나지 않는 방법을 알아보자.
slug: pymysql-encoding-error
author: 박하람
category: Python&Pandas
datetime: 2022. 07. 27.
language: Korean
featured: None
tags:
  - pymysql
  - fastapi
  - encoding error
---

최근 FastAPI로 검색 API를 구현하고 있다. 지식그래프로 구축한 데이터에서 검색에 필요한 데이터를 MySQL에 저장하고, FastAPI로 데이터를 불러오는 방식이다. 그런데 MySQL에 저장된 데이터를 pymysql로 불러오는 과정에서 인코딩 문제가 발생했다.

```py
def get_data(name):
  data = query_get(
    "SELECT * FROM table WHERE name LIKE '%%%s%%'", (name))
```

```bash
pymysql.err.ProgrammingError:
(1064, "You have an error in your SQL syntax;
check the manual that corresponds to your MySQL server version
for the right syntax to use near '\x08'부산'%'' at line 1")
```

이 API는 '부산' 이라는 키워드를 검색하면, SQL에서 부산이 포함된 행을 가져오는 것이 목적이다. `get_data`에서 키워드를 전달 받고, `name`이라는 변수에 저장한다. 그런데 키워드로 한글명을 입력하면, 위와 같이 이상한 `'\x08`이 키워드에 붙어서 나왔다. 이 인코딩 에러는 아래처럼 해결할 수 있다.

```py
def init_connection():
    connection = pymysql.connect(
        host=os.getenv("DATABASE_HOST"),
        port=3306,
        user=os.environ.get("DATABASE_USERNAME"),
        password=os.environ.get("DATABASE_PASSWORD"),
        database=os.environ.get("DATABASE"),
        cursorclass=pymysql.cursors.DictCursor,
        conv=converions,
        charset="utf8", # 추가
    )
    return connection
```

pymysql로 접속할 때 `charset="utf8"` 설정을 해주니, 키워드에 이상한 글자가 더이상 나오지 않았다. 그런데! 계속 에러가 발생했다.

```bash
pymysql.err.ProgrammingError:
(1064, "You have an error in your SQL syntax;
check the manual that corresponds to your MySQL server version
for the right syntax to use near '부산'%'' at line 1")
```

키워드에 계속해서 `'`가 붙어 나왔다. 문자열 포매팅(`%s`)과 MySQL의 와일드카드 기반 `LIKE` 검색을 같이 하려니 에러가 계속 생겼다. 왜 `'`가 계속 생기는 것인지 알 수 없었지만, 아래와 같이 해결했다.

```py
def get_data(name):
  data = query_get(
    "SELECT * FROM table WHERE name LIKE CONCAT('%%', %s, '%%')", (name))
```

`CONCAT`으로 문자열을 더해 쿼리문을 만들어줬다. `200 OK`가 떴다! 오늘도 하나 에러 해결했다! 🥰

```bash
fast_api | INFO:     123.123.123.1:12345 - "GET /entity/administrative-division-name/search?name=%EB%B6%80%EC%82%B0 HTTP/1.1" 200 OK
```
