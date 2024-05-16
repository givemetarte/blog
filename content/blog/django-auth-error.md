---
title: 'Django에서 나타난 auth_user 에러 해결하기 (django.db.utils.OperationalError: no such table: auth_user)'
description: 도커로 실행되고 있던 Django에서 나타난 auth_user 에러를 해결해보자.
slug: django-auth-error
author: 박하람
category: Python
datetime: 2024. 05. 16
language: Korean
featured: Featured
tags:
  - django
  - pandas
  - read_csv
---

갑자기 잘 돌아가고 있던 django 앱에서 오류가 나타났다. 빠르게 해결해야 하는 상황이었는데, 다행히 오류의 원인을 발견해서 빠르게 해결했다. 이 오류를 해결하는 데 도움을 준 블로그 글은 [여기](https://velog.io/@sonhm-code/%EC%9F%9D%EA%B3%A0%EC%97%90%EC%84%9C-no-such-table-authuser-%EC%97%90%EB%9F%AC-%ED%95%B4%EA%B2%B0-%EB%B0%A9%EB%B2%95)에서 확인할 수 있다.

### 에러 확인하기

디플로이 해놓은 웹 어플리케이션이 잘 안돌아가는 상황이 발생했다. 콘솔 창을 확인해보니, 장고에서 불러오는 api가 잘 안불러와지는 상황이 발생했다. 장고는 도커로 실행 중이었기 때문에 정확한 파악을 위해 도커에서 로그를 출력해봤다.

```bash
docker logs -f --tail 15 container_name
```

위의 코드를 입력하면 아래와 같이 로그를 출력할 수 있다. 이 에러에 따르면, django에서 auth_user 테이블이 존재하지 않는 것이 원인이었다.

```py
File "/usr/local/lib/python3.9/site-packages/django/db/backends/sqlite3/base.py", line 357, in execute
    return Database.Cursor.execute(self, query, params)
django.db.utils.OperationalError: no such table: auth_user
```

### 에러 해결하기

다음과 같은 방법으로 간단하게 에러를 해결할 수 있었다. 우선 장고가 돌아가고 있는 컨테이너 내부에 다음의 코드로 접속한다.

```bash
docker exec -it container_name /bin/bash
```

컨테이너 내부의 manage.py가 있는 경로에서 다음의 코드를 입력한다. `makemigrations`는 장고 내부의 데이터베이스 스키마에서 변경된 사항이 있는지 판별하고, `migrate`는 변경된 사항에 따라 마이그레이션 파일을 내부 데이터베이스에 적용한다. 장고 앱에서 변경사항은 없었지만, 해당 코드를 입력함으로써 auth_user 파일이 생성되었다.

```bash
python3 manage.py makemigrations
python3 manage.py migrate
```

이렇게 간단하게 에러 해결 완료!
