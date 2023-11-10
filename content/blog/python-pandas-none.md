---
title: 판다스에서 결측값은 모두 None으로 처리하기
description: 판다스에서 빈 값을 처리할 때, isnull()이 잘 먹히지 않을 떄가 있다. 한 줄의 코드가 있다면 간단하게 해결할 수 있다.
slug: python-pandas-none
author: 박하람
category: Data
datetime: 2023. 11. 10.
language: Korean
featured: None
tags:
  - python
  - pandas
  - None
---

파이썬에서 결측값은 None으로 처리된다. 그러나, 종종 엑셀이나 csv 파일을 열 때, 결측값이 인식되지 않고 '' 또는 np.nan 등으로 처리되는 경우가 있다.
이럴 때 `isnull()`이란 구문이 먹히지 않아 데이터 전처리가 종종 어렵다. 매일 이렇게 써야지 해놓고 잘 되지 않아서 기록으로 남겨본다.

```py
df = pd.read_excel(
    "data/sample.xlsx",
    keep_default_na=False,
    dtype=str  # 데이터타입 지정하기
)

df = df.replace({'': None}) # ''인 값은 None으로 지정
print("총 행수는 ", df.shape[0], " 입니다.", "\n")
```

첫번째 줄만 불러와도 결측값은 `isnull()`로 판별이 되지 않는다. 모든 컬럼의 데이터타입(dtype)을 `string`으로 줬기 때문에, 빈 값은 `''`로 인식된다.
이 때 `''` 값을 `None`으로 대체하는 구문 한 줄만 쓰면 `isnull()`로 결측값을 판별할 수 있다.

```py
df[df['컬럼'].isnull()]
```

부가적으로 특정 컬럼의 값이 `None`인 행만 출력하고 싶다면, 위의 코드를 작성하면 된다. (내가 만날 까먹어서 적는 코드🥲)
전체 코드는 [솜솜의 블로그](https://chaeeunsong.tistory.com/entry/NaN-%EA%B0%92%EC%9D%84-None%EC%9C%BC%EB%A1%9C-%EB%B3%80%ED%99%98%ED%95%98%EA%B8%B0)를 참고했다.
