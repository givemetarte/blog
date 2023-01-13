---
title: Blazegraph에 named graph 업로드하기
description: 수억 건의 트리플 데이터를 효과적으로 쿼리하기 위해 named graph를 생성하는 방법을 알아보자.
slug: blazegraph-named-graph
author: 박하람
category: Knowledge Graph
datetime: 2022. 07. 27. 20:20
language: Korean
featured: Featured
tags:
  - blazegraph
  - named graph
  - rest api
---

우리 연구실은 수억 개의 트리플 데이터를 blazegraph에 저장하고 있다. 특히, 여러 주제의 트리플 데이터를 하나의 데이터베이스에 저장하고 있어 특정 도메인의 데이터만 뽑아내기 어려웠다. 그래서 [blazegraph의 깃헙 위키](https://github.com/blazegraph/database/wiki/REST_API)를 뒤져서 네임드 그래프(named graph)로 저장하는 방법을 알아냈다.

## 파일 데이터로 named graph 생성하기

### Quad 데이터를 저장을 위한 네임스페이스

블레이즈그래프에서 `quads` 버전으로 네임스페이스를 생성한다. (`Full Index` 버전으로 생성해도 되고, 네임스페이스 생성 후 API로 Reindexing도 가능하다.) 네임드 그래프 질의를 위해서 s, p, o, q 데이터를 처리할 수 있는 네임스페이스를 만드는 것이 시작이다.

<img src="/blazegraph-named-graph/blaze-namespace-quad.png" class="img"/>

네임스페이스를 파지 않고 blazegraph를 구동할 때부터 `Quads` 검색을 허용하려면, [index.properties](https://github.com/opencitations/triplestore-index)를 사용하여 blazegraph를 실행하면 된다. 주의할 점은 아래와 같이 `Quads` 모드를 허용해주어야 한다. 또한 index.properties 파일로 blazegraph.jar를 실행해야 한다.

```bash
# Support quads
com.bigdata.rdf.store.AbstractTripleStore.quads=true
```

```bash
# blazegraph.jar가 있는 경로에서 실행
java -server -Xmx8g -Dbigdata.propertyFile=index.properties -jar blazegraph.jar
```

### REST API로 데이터 업로드하기

blazegraph는 REST API로 트리플 데이터를 업로드할 수 있다. REST API로 데이터를 업로드하기 위해서 SPARQL 엔드포인트가 필요하다. 쿼드를 허용한 blazegraph를 실행하는 경우, SPARQL 엔드포인트는 비교적 간단하다. 새로운 네임스페이스를 판 경우, SPARQL 엔드포인트 경로는 네임스페이스의 이름을 포함한다.

```bash
# kb(default)
http://localhost:9999/blazegraph/sparql

# 새로운 네임스페이스
http://localhost:9999/blazegraph/namespace/{NAME}/sparql
```

이제 트리플 데이터를 네임드 그래프로 업로드해보자. 업로드하기 원하는 데이터의 파일 경로로 이동하고, 아래처럼 터미널에 작성하면 된다. SPARQL 엔드포인트의 `named-graph`에 네임드 그래프로 설정할 URI를 작성한다.

```bash
# 파일 경로 이동
cd Documents/folder1/folder2

# context-uri에 named graph 설정
curl -D- -H 'Content-Type: text/turtle' --upload-file sample.ttl -X POST 'http://localhost:9999/blazegraph/sparql?context-uri=http://{named-graph}'
```

정상적으로 업로드되면, 업로드한 트리플 개수와 걸린 시간이 출력된다.

### SPARQL 쿼리로 named graph 질의하기

named graph로 질의가 잘 되는지 확인해보자. named graph는 `FROM` 구문에 named graph의 URI를 작성한다.

```sql
SELECT ?s ?p ?o FROM <http://{named-graph}>
WHERE {
	?s ?p ?o
} LIMIT 10
```

결과가 정상적으로 나오면 성공! Blazegraph에서 파일 단위로 named graph를 선언하는 방법에 대해 알아보았다. 아직 Bulk Data로 named graph를 업로드 하는 방법은 파악하지 못한 상태... 😭
