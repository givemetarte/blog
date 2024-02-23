---
title: Docker로 MySQL을 실행하고, 파이썬으로 local_infile 에러 수정하기 (feat. Loading local data is disabled; this must be enabled on both the client and server sides)
description: 한 줄씩 텍스트 파일을 읽지 않고, 한 번에 텍스트 파일을 MySQL에 업로드하는 방법에 대해 알아보자.
slug: mysql-docker-python
author: 박하람
category: MySQL
datetime: 2024. 02. 23.
language: Korean
featured: None
tags:
  - MySQL
  - local_infile
---

이전 [블로그 포스팅](/blog/mysql-local-infile)에서 `local infile` 에러를 수정하는 방법을 설명했다. 그런데 그 때의 환경은 우분투에서 직접 MySQL로 conf 파일을 변경하는 방법이었다면, 이제는 Docker로 MySQL을 실행했을 때 파이썬으로 `local infile` 에러를 해결하는 방법이다. 서버 뿐만 아니라 클라이언트에서 모두 `local infile` 에러를 해결하는 방법을 설명한다.

### LOCAL INFILE 에러

도커로 MySQL을 실행하고, `pymysql`을 이용해 `local infile` 코드를 실행하려고 했을 때 나타난 에러다. 이 에러는 클라이언트와 서버 단에서 모두 `local infile`을 실행하라고 설명한다. 실제로 서버 단에서만 수정하면 아래와 같은 에러가 동일하게 나타난다. `/etc/mysql/my.cnf`에서 수정해야 하는 것들은 모두 `--`를 붙이고 실행해주면 된다.

```
OperationalError: (3948, 'Loading local data is disabled; this must be enabled on both the client and server sides')
```

### 서버 단에서 허용하기

서버 단에서 허용하는 방법은 `set global local_infile=true;`로 설정해 줄 수도 있지만, 이 경우 도커를 restart 하면 다시 off로 되돌아가는 문제가 발생한다. 아래 코드는 docker image를 run할 때부터 환경설정으로 `loose-local-infile=1`을 설정해주는 방식이다.

```bash
docker run --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql:latest --loose-local-infile=1
```

### 클라이언트 단에서 허용하기

위와 같이 서버 단에서 `local infile`을 허용해줘도 똑같은 에러가 발생했다. 이 경우는 pymysql로 MySQL과 연결할 때 `local_infile=True`라는 조건을 추가해주면 된다.

```py
def init_db_connection():
    connection = pymysql.connect(
        host="localhost",
        port=3306,
        user="********",
        password="****",
        database="testdb",
        cursorclass=pymysql.cursors.DictCursor,
        charset="utf8",
        local_infile=True # 클라이언스 상에서 조건 추가
    )
    return connection
```
