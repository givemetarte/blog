---
title: 'cryptography' package is required for sha256_password or caching_sha2_password auth methods 에러 해결하기
description: flask로 구축한 API를 호출할 때 cryptography 패키지 오류가 나타났다. 이 오류를 해결하는 간단한 방법에 대해 알아보자.
slug: python-flask-api-error
author: 박하람
category: Python
datetime: 2024. 03. 28.
language: Korean
featured: None
tags:
  - cryptography
  - flask
  - api
---

멀쩡하게 잘 돌아가던 flask API 서버가 특정 호출에 대해서 잘 작동하지 않았다. 에러 유형을 살펴보고, 간단하게 해결하는 방법을 알아보자.

### 에러 발생

API 호출이 제대로 작동하지 않은 곳을 보니, 다음과 같은 에러가 발생했다. 이 API는 MySQL로부터 flask로 데이터를 가져와서 정제한 후 Json 형식으로 데이터를 뿌려주는 역할을 수행한다. 그런데 다음과 같이 생전 처음보는 에러가 나왔다.

```bash
RuntimeError: 'cryptography' package is required for sha256_password or caching_sha2_password auth methods
```

### 에러 해결하기

다행히 [stackoverflow]에서 이 에러에 대해 해결할 수 있는 간단한 방법을 제공했다. 직접적으로 이 모듈을 사용하지 않았는데, pymysql에서 db 데이터를 끌어오는 과정에서 간접적으로 사용했던 것으로 추정된다.

```bash
pip install cryptography
```

이 모듈을 설치한 다음 여전히 정상적으로 작동하지 않아서 이게 해결되지 않은 걸까 생각했는데... 도커로 API 서버를 돌리고 있어서 새로운 모듈을 설치한 다음 도커를 restart 해줘야 했다(까먹지 말자...🥲)
