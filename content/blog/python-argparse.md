---
title: argparse로 파이썬 script 실행시 인자 추가하기 (.env 파일에 변수 저장)
description: 파이썬 script 파일을 실행할 때 인자를 추가해 코드를 실행해보자. 추가적으로 `.env` 파일에 인자로 받은 변수를 저장하는 방법도 설명한다.
slug: python-argparse
author: 박하람
category: Python
datetime: 2024. 08. 09.
language: Korean
featured: None
tags:
  - argparse
  - env
---

파이썬 script를 실행할 때 `argparse`를 사용하면 사용자가 작성한 인자를 기반으로 코드를 실행할 수 있다. 오늘 포스팅은 `argparse`의 간단한 사용방법과 함께 인자로 가져온 변수를 `.env`에 저장하는 방법도 함께 사용한다.

### 인자 정의하기

다음과 같이 파이썬 script를 실행할 때 `--month`라는 인자에 사용자가 직접 변수를 넣어 코드를 실행하도록 만들어보자.

```bash
python test.py --month=202406
```

`month`라는 인자를 내부에서 변수로 정의하는 방법은 다음과 같다. `ArgumentParser`를 정의한 다음, `add_argument`로 입력받을 인자명을 정의한다.
`parse_args()`로 인자를 파싱한 다음 `args.month`로 출력하면 입력받은 인자값이 출력된다.

```py
import argparse

parser = argparse.ArgumentParser(description="Update values")
parser.add_argument("--month", help="Update month (format: YYYYMM)")
args = parser.parse_args()

print(f"Update month: {args.month}")
```

### `.env` 파일에 저장하기

추가적으로 인자로 받은 변수를 `.env` 파일에 저장할 수 있다. 보통은 `.env` 파일에 외부에 공유하지 않을 설정변수를 저장하는데, 다음과 같이 DB 접속에 대한 변수도 저장해놨다.

```
# DB 설정
DATABASE_HOST="***.***.***.**"
DATABASE_USERNAME="user"
DATABASE_PASSWORD="password"
DATABASE='test1'
```

파이썬 script마다 DATABASE를 바꿔서 DB에 접속하려면 다음과 같이 작성할 수 있다. `set_key`를 사용해 인자로 받은 args.db로 받은 인자를 `.env` 파일에 저장할 수 있다.

```py
from dotenv import load_dotenv, set_key
import argparse

# load .env
load_dotenv()

parser = argparse.ArgumentParser(description="Update values")
parser.add_argument("--db", help="DB name")
args = parser.parse_args()

if args.db:
    os.environ["DATABASE"] = args.db
    set_key(".env", "DATABASE", args.db)

print(f'DATABASE: {os.environ["DATABASE"]}')
```

다음과 같이 script 파일을 실행하면 `DATABASE`의 출력결과로 `test2`가 나오는 것을 확인할 수 있다.

```bash
python test.py --db=test2
```
