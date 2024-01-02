---
title: flask로 간단한 API 서버 만들기
description: 간단한 API 서버를 만들어야 하는데 django를 쓰기엔 너무 무거울 때 flask로 빠르게 개발해보자.
slug: python-flask-api-server
author: 박하람
category: Python
datetime: 2023. 12. 21.
language: Korean
featured: None
tags:
  - python
  - flask
  - api server
---

파이썬으로 간단한 API를 만들어야 하는 일이 있었다. RDB는 붙이지 않고, 파일 데이터를 가공해서 API로 제공해주는 간단한 서버가 필요했다. 무거운 장고 보다는 간단한 flask가 적절하다고 생각해서 flask로 간단한 api 서버를 만들어봤다.

### 폴더 구조 만들기

flask 서버는 정해진 폴더 구조가 딱히 없는 것 같지만, 다음과 같이 구성하면 그래도 편하게 사용할 수 있다.

```
flask-api-server
├ requirements.txt
├ main.py
├ views.py
⎿ setup

```
