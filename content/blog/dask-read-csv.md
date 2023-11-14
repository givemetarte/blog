---
title: 파이썬으로 대용량 CSV 파일 열기 (feat. pandas와 dask)
description: 건축물대장의 주택가격 txt 파일은 자그마치 26G다. 판다스로 열면, 30분 걸려도 메모리 에러로 안 열리는 파일을 dask로 1초 만에 열린다!
slug: dask-read-csv
author: 박하람
category: Python&Pandas
datetime: 2022. 08. 17.
language: Korean
featured: Featured
tags:
  - dask
  - pandas
  - read_csv
---

국토부는 [세움터의 건축데이터개방](https://open.eais.go.kr/opnsvc/opnSvcInqireView.do?viewType=7)에서 건축물대장의 주택가격 대용량 데이터를 제공하고 있다. 이 데이터를 활용하여 부산 지역의 건축물대장PK와 주택가격 정보만 추출하려고 한다. 그런데 건축물대장의 주택가격 txt 파일은 자그마치 26G다. pandas로 데이터를 읽으려 했더니, 40분 이상 `read_csv`가 돌면서 메모리 에러로 열리지 않았다. 방법을 찾아보다가 해결한 방법은 바로 대용량 데이터를 분산처리하는 패키지 `dask`를 사용하는 것이다.

### 설치하기

설치하는 방법은 간단하다. 아래와 같이 설치해주면 된다.

```bash
pip install dask
```

### 데이터 불러오기

`dask`는 `pandas`와 구문이 비슷해서 `pandas`에 익숙한 사람이라면 쉽게 사용할 수 있다. 데이터를 처리하기 위한 모듈을 import 해주고, `pd.read_csv` 대신 `dd.read_csv`로 텍스트 파일을 읽어준다. 파라미터 `dtype=str`은 모든 데이터를 string으로 불러 불러오는 시간을 조금 단축해준다. 파라미터 `on_bad_lines="skip"`은 파싱하기 어려운 행을 무시하고 데이터를 읽는 작업을 진행한다. 파라미터 `engine=python`은 c보다 속도는 느리지만, 다양한 seperator를 지원하고, dtype을 사용할 수 있다. TXT 파일은 seperator가 `|`이므로 파이썬 엔진을 사용해야 한다.

```py
import pandas as pd
import glob
from tqdm import tqdm
import dask.dataframe as dd

def make_sido_code(row):
    return str(row["시군구코드"])[:2]

price = dd.read_csv("data/rawdata/building/주택가격/mart_djy_08.txt", \
                    sep="\|", dtype=str, encoding='cp949', \
                    on_bad_lines="skip", header=None, engine='python')

# the number of partitions : 416개
print(f"건축물대장의 주택가격이 분할된 파일 개수는 {price.npartitions}개입니다.")
```

`dask`는 하나의 데이터를 여러 개의 `pd.DataFrame`으로 나누어 병렬적으로 데이터를 읽는다. 주택가격 데이터는 `price.npartitions`의 개수가 무려 416개다. 즉, 주택가격 데이터는 416개의 데이터프레임을 병렬적으로 처리한다. 여기까지 걸린 시간은 2초다.

### 데이터 전처리하기

주택가격 데이터 중 부산지역의 주택가격 데이터만 올 것이다. 부산 지역의 시도코드는 26이다. 주택가격 데이터 중 시도코드가 26인 행과 필요한 컬럼만 가져오고, 생성일자가 최신인 행만 가져온다.

```py
price_df = price[[0,8,23,24]]
price_df.columns = ["관리상위건축물대장PK","시군구코드","주택가격","생성일자"]
price_df["시도코드"] = price_df.apply(make_sido_code, axis=1, meta=object)
price_df = price_df.loc[price_df["시도코드"] == "26"]

# preprocessing
price_df["관리상위건축물대장PK"] = price_df["관리상위건축물대장PK"].map(lambda x: x.strip())
price_df = price_df.map_partitions(lambda df: df.sort_values(by="생성일자", ascending=False))
price_df = price_df.drop(["시도코드"], axis=1).drop_duplicates()
```

주의할 점은 전처리된 데이터가 병렬적인 판다스 데이터프레임의 형태라는 것이다. 전처리가 잘 되었는지 `print`를 하면, `None` 값이 나올 수 있다. 416개의 데이터프레임 중 일부 데이터프레임의 결과만 보여주기 때문이다. 전체 결과는 판다스의 데이터프레임으로 변환하여 확인할 수 있다.

### 판다스의 데이터프레임으로 변환하기

`dask`의 데이터프레임은 `compute()`를 통해 `pandas`의 데이터프레임으로 변환할 수 있다. 가공한 데이터는 `pandas`의 데이터프레임으로 변환 후 csv로 저장한다.

```py
# convert dask to pandas
busan_price_pdf = price_df.compute()

# save csv
busan_price_pdf.to_csv("data/refined-data/busan-price.csv", encoding="utf-8", index=False)
```

데이터 전처리부터 `pandas`의 데이터프레임으로 변환하는 데까지 약 43분 27초가 소요되었다. `pandas`의 데이터프레임으로 열 수 없었지만, `dask`로 무사히 열고 전처리 할 수 있다!

### 마지막으로

모든 코드는 GitHub으로 공개하고 있다. 공개된 코드는 건축물대장의 주택가격을 포함해 표제부와 기본개요 데이터를 가공하는 방법도 포함한다. 전체 코드는 👉 [dask-bigdata-tutorial](https://github.com/givemetarte/dask-bigdata-tutorial/blob/main/dask-big-data.ipynb)에서 확인할 수 있다.
