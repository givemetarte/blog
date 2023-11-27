---
title: MySQL 데이터를 TXT 파일로 저장하기 (feat. outfile)
description: MySQL에 저장된 데이터를 batch file로 제공해야 할 때가 있다. outfile 코드를 사용하면 간단하게 MySQL로 저장된 데이터를 TXT 형식으로 다운로드 받을 수 있다.
slug: mysql-local-infile
author: 박하람
category: MySQL
datetime: 2023. 11. 15.
language: Korean
featured: None
tags:
  - MySQL
  - outfile
---

MySQL에 저장된 데이터를 파일 형태로 제공해줘야 할 때가 있었다. MySQL은 특정 컬럼 또는 조건에 부합하는 데이터만 뽑아 TXT나 CSV 파일로 저장할 수 있는 코드를 제공한다.

```sql
select {컬럼1}, {컬럼2}, {컬럼3}, {컬럼4}
into outfile '{다운로드 파일명}.txt'
fields terminated by '|'
lines terminated by '\n' from {테이블명};
```

코드에 대한 설명은 다음과 같다.

- select 구문은 원하는 컬럼명을 지정한다.
- `into outfile` 다음은 다운로드 될 데이터의 파일명과 확장자를 작성한다.
- `fields terminated by`는 컬럼을 구분할 구분자를 선택한다.
  - 구분자를 쉼표로 하게 되면, 데이터 값에 쉼표가 포함된 경우 서로 다른 컬럼으로 구분될 수 있다. 데이터 값에 따라 적절한 구분자를 선택해야 한다.
- `lines terminated by`는 한 줄을 구분하는 구분자를 선택한다.
