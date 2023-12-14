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

MySQL에 있는 데이터를 뽑아서 파일 형태로 제공해줘야 할 일이 생겼다. `MySQL`은 DB 안의 데이터를 파일 형태로 다운로드 받을 수 있는 기능을 제공한다. 한줄의 코드가 있다면 쉽게 MySQL에서 데이터를 다운로드 받을 수 있다.

### MYSQL에서 TXT로 내보내기

`MySQL`에서 다음의 코드를 실행해주면 된다.

- `SELECT` 다음은 추출하고 싶은 컬럼명을 작성한다.
- `INTO OUTFILE` 다음은 데이터의 파일명을 작성한다. 이 때, 확장자는 다운로드받고 싶은 확장자로 작성한다.
- `FIELD TERMINATED BY` 다음은 컬럼의 구분자를 작성하고, `LINES TERMINATED BY` 다음은 행의 구분자를 작성한다
- `FROM` 다음은 다운로드 받고싶은 테이블명을 작성한다

```sql
SELECT column1, column2, column3, column4 INTO OUTFILE 'file_name.txt'
FIELD TERMINATED BY '|' LINES TERMINATED BY '\n' FROM table_name;
```

컬럼 구분자와 행 구분자를 선택할 때 주의해야 할 점이 있다. 값에 구분자로 들어갈 값 (예: 쉼표, 온점)이 존재하는 경우는 컬럼이나 행이 잘 구분되지 않을 수 있다.
위의 구분자는 데이터에 존재할 가능성이 적어서 컬럼 또는 행의 구분이 잘 된다.

### 파일이 다운로드된 경로

본인은 우분투 환경에서 `MySQL`을 실행했다. 보통은 `MySQL` 데이터가 저장되는 경로에 다운로드 데이터가 저장된다.
(개별적으로 데이터 경로를 지정해줄 수 있지만, conf 파일을 변경해야 하는 관계로 데이터 저장경로를 변경하지 않았다.)

```
/var/lib/mysql/{db명}
```

`{db명}`은 다운로드 받을 테이블이 존재하는 데이터베이스의 이름을 작성한다.
