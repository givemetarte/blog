---
title: local infile을 사용해 TXT 파일을 MySQL에 저장하기
description: 한 줄씩 텍스트 파일을 읽지 않고, 한 번에 텍스트 파일을 MySQL에 업로드하는 방법에 대해 알아보자.
slug: mysql-local-infile
author: 박하람
category: MySQL
datetime: 2023. 11. 15.
language: Korean
featured: None
tags:
  - MySQL
  - local_infile
---

상당히 규모가 있는 데이터는 RDB에 저장해 관리하는 것이 편하다. 텍스트 형태로 제공되는 batch file은 MySQL에 한 번에 저장하는 방법이 필요하다. MySQL은 `LOCAL INFILE` 구문을 사용해 파일 자체를 MySQL의 테이블에 집어넣을 수 있다. `LOCAL INFILE`로 데이터를 업로드하며 여러가지 시행착오를 겪었는데, 이슈를 해결한 결과는 다음과 같다.

### 테이블 스키마 만들기

MySQL에 데이터가 업로드되려면, 테이블 스키마가 생성되어야 한다. 나의 MySQL 작업 환경은 터미널이라 테이블 스키마를 생성하는 `.sql` 파일을 만들었다. 터미널에서 아래 코드를 실행하면, 해당 `.sql` 파일에 담긴 코드가 실행된다.

- `{USER명}`: MySQL에 접속할 때 사용하는 사용자명 작성
- `{DB명}`: 해당 테이블이 만들어지는 데이터베이스명 작성
- `{파일 경로}/{테이블 스키마가 담긴 파일명}.sql`: 실행하고 싶은 sql 파일의 경로와 파일 이름을 같이 작성

```bash
$ mysql -u {USER명} -p --database={DB명} < {파일 경로}/{테이블 스키마가 담긴 파일명}.sql
```

### 서버에 업로드할 데이터 올리기

MySQL에 데이터를 올리려면, 서버에 업로드할 파일을 올리는 것이 편하다. wget으로 서버에 바로 batch file을 다운로드 받고, 해당 파일의 압축을 해제했다. 그러나, 우분투에서 바로 압축을 해제하면 인코딩이 `iso-8859-1`로 나온다. 즉, 한글 데이터가 모두 깨진다..🥲 다운로드 받은 batch file은 인코딩이 ``cp949`로 압축을 해제하고, `utf8`로 인코딩을 변경하면 MySQL에 데이터를 올려도 한글이 깨지지 않는다.

```bash
# cp949로 압축 해제
$ unzip -O cp949 {파일명}.zip

# 현재 디렉토리에 있는 모든 파일을 대상으로 cp949 > uft8fh 인코딩 변경
$ find . -type f -exec bash -c 'iconv -f cp949 -t utf-8 {} > {}.utf8 && mv {}.utf8 {}' -- {} \;
```

### `LOCAL INFILE`로 MySQL에 파일 데이터 업로드하기

서버에 파일이 준비되면, MySQL에서 `LOCAL FILE` 코드를 실행한다. 파일은 TXT 형식이므로 |으로 구분되도록 설정해준다.

```sql
LOAD DATA LOCAL INFILE "{파일경로}" INTO TABLE {테이블명} FIELDS TERMINATED BY "|";
```

`SELECT` 구문으로 간단하게 데이터 10행을 출력하면 데이터가 잘 들어갔는지 확인할 수 있다.

### 추가: [Errno 51] Network is unreachable

```
Can't connect to MySQL server on 'xxx.xxx.xxx.xx' ([Errno 51] Network is unreachable)
```

파이썬 환경에서 `LOCAL INFILE` 코드를 실행하면, 에러코드 51번을 출력할 때가 있다. 이것도 [이전 포스트](/blog/mysql-allow-access)와 동일하게 해당 유저가 외부 접속이 허용되지 않기 때문에 발생한 문제다. 이 때도 해당 유저에게 외부 접근을 허용하는 권한을 설정해주면 된다.

```sql
CREATE USER 'harampark'@'%' identified by '{비밀번호}';
GRANT ALL PRIVILEGES ON {DB명}.* to 'harampark'@'%';
flush privileges;
```

이제 진짜 `LOCAL FILE`로 업로드 끝!
