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

MySQL에 직접 텍스트 형태의 batch 데이터를 넣어줘야 했다. 테이블은 이미 생성되어 있는 상황에서 batch 데이터를 업로드 하는 방법에 대해 설명한다.

### LOCAL INFILE로 데이터 업로드

```sql
LOAD DATA LOCAL INFILE "{directory/filename.txt}" INTO TABLE {table_name}
FIELDS TERMINATED BY "|";
```

- `{directory/filename.txt}`: batch 파일이 저장된 경로를 입력한다.
- `{table_name}`: batch 파일을 업로드할 테이블 이름을 작성한다.
- `FIELDS TERMINATED BY`: 컬럼명을 구분할 구분자를 선택한다. 위의 코드는 |을 구분자로 설정한다.

### 오류: 데이터 경로 인식하기

sql 코드가 batch 파일이 저장된 경로를 인식하지 못할 수 있다. 이 경우 MySQL의 데이터 디렉토리 위치에 데이터를 옮겨놓으면 대부분 인식한다. 데이터 디렉토리의 위치를 확인하는 방법은 다음과 같다.

```sql
mysql> show variables like 'datadir';
+---------------+-----------------+
| Variable_name | Value           |
+---------------+-----------------+
| datadir       | /var/lib/mysql/ |
+---------------+-----------------+
1 row in set (0.01 sec)
```

서버의 MySQL 데이터 경로는 `/var/lib/mysql/`이다. 이 경로는 MySQL의 데이터베이스와 테이블이 저장된 경로다. 따로 폴더를 생성해서 batch 데이터를 여기로 이동한 다음, `local infile`의 경로로 이동한 폴더의 경로로 잡으면 무사히 작동한다.
