---
title: MySQL에서 외부 접속 허용하기 (+ .env 수정사항이 안 먹힐 때)
description: pymysql로 외부 서버에 있는 MySQL에 접속하려면 외부 허용이 필요하다. 간단하게 외부 접근을 허용하는 방법에 대해 알아보자.
slug: mysql-allow-access
author: 박하람
category: MySQL
datetime: 2023. 11. 14.
language: Korean
featured: None
tags:
  - MySQL
  - pymysql
---

내 로컬 컴퓨터에서 외부에 있는 MySQL의 데이터를 불러와 데이터 작업을 하려고 했다. 각종 변수는 `.env` 파일에 저장해두고, 아래 코드를 돌렸더니...!

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
        charset="utf8",
    )
    return connection

def query_get(sql, param):
    connection = init_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(sql, param)
            return cursor.fetchall()

data = query_get("SELECT * FROM full_rna_address LIMIT 10", ())
data
```

다음과 같은 에러가 나왔다! 로컬 터미널에서 MySQL의 내 계정으로 접속이 가능해서 파이썬에서도 접속이 가능할꺼라 생각했는데, 접근 허용 설정이 잘 안되었다.

```
OperationalError: (1045, "Access denied for user 'harampark'@'xxx.xxx.xx.xx' (using password: YES)")
```

### MySQL에서 외부 접속을 허용하는 방법

파이썬 환경에서 접속 가능하려면, 내 MySQL의 ID에 외부 접속에 대한 허용 권한을 설정해줘야 한다. `harampark`에 대한 권한은 `root` 계정이 설정할 수 있다. `root` 계정으로 MySQL에 접속한 다음, 다음의 코드를 입력한다.

```bash
grant all privileges on *.* to 'harampark'@'%'; # harampark이 접속 가능한 권한 열어둠
flush privileges; # 변경사항 저장

# 설정 확인하기
use mysql;
select host, user from user;
```

권한 설정이 잘 되었는지 확인하고 싶다면, user 테이블에서 `harampark`의 host가 %로 설정되었는지 확인한다.
다시 위의 코드를 돌렸더니 데이터가 잘 출력된다 🥰

### 추가: `.env` 수정사항이 잘 안 먹힐 때

개인정보가 담긴 데이터는 모두 `.env` 파일에 저장하고, 깃헙에 올리지 않고 있다.
그런데 `.env`에 담긴 값을 변경해도 변경사항이 잘 작동하지 않는 문제가 발생했다. 찾아보다가 [이 블로그](https://blog.naver.com/PostView.naver?blogId=hellojinny_&logNo=222473400245&parentCategoryNo=&categoryNo=152&viewDate=&isShowPopularPosts=true&from=search)에서 os.environ은 처음 파이썬 시작 중에 os 모듈을 처음 가져올 때 지정된다고 한다. 즉, 파이썬이 이미 실행된 상태에서 `.env`의 내용을 바꿔도 `os.environ`이 잡아내지 못한다는 의미다.

![파이썬 커널 변경하기](/mysql-allow-access/vscode-python-kernel.png)

이럴 때 VSCODE에서 파이썬 커널을 변경하고, 다시 처음부터 코드를 실행하면 변경사항이 잘 작동한다! .conda (Python 3.9.16)을 잠시 Python 3.8.6으로 바꿔주고, 다시 .conda로 커널을 선택한 후 코드를 실행하면 변경사항이 적용된다.
