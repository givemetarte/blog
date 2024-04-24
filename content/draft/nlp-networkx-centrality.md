---
title: 동시출현 빈도로 네트워크 분석하기 (feat. networkx)
description: 논문의 제목과 초록 데이터로 동시출현 빈도 매트릭스를 추출하고, 텍스트 중심성을 분석하고 시각화해보자.
slug: nlp-networkx-centrality
author: 박하람
category: NLP/LLM
datetime: 2024. 04. 04.
language: Korean
featured: None
tags:
  - networkx
  - degree centrality
  - eigenvector centrality
  - closeness centrality
  - Betweenness centrality
---

. clossness centrality
ucinet은 모두 19로 통일됨 (정규화 안 한 결과).
파이썬은 정규화한 결과.

. betweeenness centrality
Ucinet 결과가 0인 이유는 A에서 B까지 가는데 걸치는 노드 개수를 세는 것인데, 모든 것이 연결되어 있으면 0이 나옴.
근데 파이썬은 최대 500개까지 뽑은 것이니까 모든 것이 연결되지 않을 수 있으니까 차이가 있음
