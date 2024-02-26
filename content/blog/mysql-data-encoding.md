---
title: 파이썬을 이용해 도로명주소 데이터를 MySQL에 업로드하기 (feat. cp949와 utf8 인코딩 문제 해결)
description: 주소기반산업지원서비스에서 제공하는 도로명주소 한글 데이터를 utf8로 인코딩된 MySQL에 업로드해보자.
slug: mysql-data-encoding
author: 박하람
category: MySQL
datetime: 2024. 02. 26.
language: Korean
featured: None
tags:
  - MySQL
  - encoding
  - utf8
  - cp949
---

[지난번 포스팅](/blog/mysql-docker-python)은 파이썬으로 `local infile` 에러를 수정하는 방법에 대해 알아봤다. 이번 포스팅은 `local infile`을 이용해 실제 데이터를 넣는 과정에서 나타난 에러를 해결하는 방법이다. 막상 `local infile`로 데이터를 업로드하려고 하니, 파일 인코딩 문제로 업로드가 잘 되지 않았다. 업로드할 데이터는 [주소기반산업지원서비스에서 제공하는 도로명주소 한글](https://business.juso.go.kr/addrlink/attrbDBDwld/attrbDBDwldList.do?cPath=99MD&menu=%EB%8F%84%EB%A1%9C%EB%AA%85%EC%A3%BC%EC%86%8C%20%ED%95%9C%EA%B8%80)인데, 이 txt 파일의 인코딩이 cp949이고 MySQL의 인코딩은 utf8이기 때문이었다.

### 파일 가져오기

도로명주소 한글을 다운받고, 다운된 텍스트 파일은 압축을 풀어 `data/rnaddrkor/` 경로에 저장했다. 이 도로명주소 한글은 (1) 도로명주소(rnaddrkor)와 (2) 관련지번(jibun_rnaddrkor)로 테이블이 구분되어 있는데, 모두 17개의 시도파일로 저장된다. 이 파일 중에서 도로명주소에 해당하는 데이터세트만 불러오는 코드는 다음과 같다.

```py
import glob

file_list = glob.glob("data/rnaddrkor/rnaddrkor_*.txt")

for file in file_list:
    print(file)
```

### 인코딩 변환 (cp949 → utf8) 후 데이터 업로드하기

위의 `file`로 데이터를 업로드할 때, 계속해서 인코딩 에러가 떴다. 도로명주소 한글은 cp949로 인코딩 되어 있는데, 나의 MySQL 데이터베이스는 utf8로 인코딩이 지정되어 있기 때문이었다. 도로명주소 데이터를 cp949로 열어 모두 utf8로 인코딩을 변환한 후 저장하려니까 상당한 시간이 걸렸다. 그래서 도로명주소 데이터를 cp949로 연 다음에, 임시 파일에 utf8로 데이터를 저장하고 데이터를 MySQL로 업로드하는 방법을 사용했다.

```py
def query_update(sql):
    connection = init_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(sql)
            connection.commit()
            return True
```

위의 코드는 `query_update` 함수다. 이 함수는 MySQL과 연결한 다음 SQL 쿼리를 커밋한다. `init_db_connection` 함수는 [지난번 포스팅](/blog/mysql-docker-python)에서 설명하고 있다. 다음은 도로명주소 데이터를 cp949로 읽은 다음, utf8로 변환한 후 MySQL에 업로드하는 파이썬 코드다. 데이터 업로드가 완료된 임시 파일은 삭제된다. `line_count`와 `total_line_count`는 도로명주소 한글의 총 행수를 계산하기 위한 코드다.

```py
import os
from tqdm import tqdm

total_line_count = 0  # 총 행수를 저장할 변수

for file in tqdm(file_list, desc='Processing files'):
    file_path = os.path.abspath(file)

    # cp949로 파일 읽고 행 불러오기
    with open(file_path, 'r', encoding='cp949', errors='ignore') as f:
        lines = f.readlines()

    # 행 수 계산
    line_count = len(lines)

    # 총 행 수에 더하기
    total_line_count += line_count

    # cp949로 읽은 파일을 utf8로 임시파일에 저장
    temp_file_path = "temp_file.txt"
    with open(temp_file_path, 'w', encoding='utf8') as f:
        f.writelines(lines)

    sql = f'''
        LOAD DATA LOCAL INFILE "{temp_file_path}" INTO TABLE rnaddrkor
        FIELDS TERMINATED BY "|";
    '''
    print(f"Processing file: {file_path}, Number of lines: {line_count}")
    query_update(sql)

    # 임시파일 삭제
    os.remove(temp_file_path)

print(f"Total number of lines: {total_line_count}")
# Processing files: 100%|██████████| 17/17 [01:43<00:00,  6.12s/it]
# Total number of lines: 6384988
```

총 6,384,988행의 도로명주소 데이터가 MySQL의 rnaddrkor 테이블에 업로드됐다! 물론 데이터를 업로드하기 전에 rnaddrkor 테이블의 스키마를 생성했어야 한다. 이 스키마는 [도로명주소 한글](https://business.juso.go.kr/addrlink/attrbDBDwld/attrbDBDwldList.do?cPath=99MD&menu=%EB%8F%84%EB%A1%9C%EB%AA%85%EC%A3%BC%EC%86%8C%20%ED%95%9C%EA%B8%80) 옆에 있는 `도로명주소 한글 활용` 버튼을 클릭하면, 팝업창에서 개별 테이블의 스키마를 확인할 수 있다.
