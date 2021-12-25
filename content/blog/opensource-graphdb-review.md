---
title: 그래프 데이터베이스 Blazegraph, Virtuoso와 GraphDB 설치와 데이터 업로드
description: 오픈소스 그래프 데이터베이스 blazegraph, graphdb와 virtuoso의 오픈소스 버전을 설치하고, 데이터를 업로드 해보자.
slug: opensource-graphdb-review
author: 박하람
category: Knowledge Graph
datetime: 2021. 12. 24.
language: Korean
featured: Featured
tags:
  - knowledge graph
  - blazegraph
  - virtuoso
  - graphdb
---

3억 개의 트리플 데이터를 그래프 데이터베이스에 넣어보자. 오픈소스 또는 무료 버전의 Graph DB에 적지 않은 트리플 데이터를 저장하는 것은 정말 쉽지 않았다. Blazegraph, Virtuoso와 GraphDB를 설치하고, 덤프 데이터를 업로드했던 과정을 정리해본다. 개발환경은 MacOS 기반이다.

### Blazegraph 오픈소스 버전

#### Blazegraph 설치

<div class="note">

👀 Blazegraph 다운로드: [LINK](https://github.com/blazegraph/database/releases/tag/BLAZEGRAPH_2_1_6_RC) (2.1.6)

</div>

Blazegraph는 오픈소스로 개발된다. 가장 많이 사용하고 잘 알려져 있는 그래프 데이터베이스 중 하나다. 대표적으로 위키데이터와 AutoDesk 등이 Blazegraph를 사용한다. 사용자가 많다보니 커뮤니티가 잘 형성되어 있고, 관련 영어 게시글을 찾는 것이 어렵지 않다.(물론 한국어로 된 글은 찾기 어렵다 🥲) 설치 방법과 제공 기능은 Blazegraph의 [Github Wiki](https://github.com/blazegraph/database/wiki)에 잘 정리되어 있다.

```bash
$ java -server -Xmx4g -jar blazegraph.jar
```

Blazegraph를 다운로드하는 가장 쉬운 방법은 Github에서 배포하는 `bigdata.jar` 또는 `blazegraph.jar` 파일을 원하는 폴더 경로에 다운받으면 된다[^1]. 물론 자바가 컴퓨터에 깔려있어야 하고, `Java 8`에서 안정적으로 작동한다. [도커 이미지](https://github.com/lyrasis/docker-blazegraph)로도 다운로드 가능하다[^2]. 터미널 환경에서 아래 코드를 실행하면 `http://localhost:9999`에서 blazegraph workbench 화면이 보인다.

![Blazegraph namespace](/opensource-graphdb-review/blazegraph-namespace.png)

Blazegraph는 기본적으로 `kb`라는 네임스페이스를 사용한다. 새로운 네임스페이스를 생성하려면, `NAMESPACES` 탭에서 원하는 이름으로 네임스페이스를 생성한다. 해당 네임스페이스를 사용하기 위해서는 반드시 `Use`를 눌러 `In use` 상태로 바꿔야 한다.

#### Blazegraph 데이터 업로드

![Blazegraph update](/opensource-graphdb-review/blazegraph-update.png)

데이터를 업로드하는 가장 쉬운 방법은 `UPDATE` 탭의 하단에 `.rdf`나 `.ttl` 파일을 드래그하는 것이다. 200MB 이상의 파일은 파일 경로를 입력하여 데이터를 업로드하면 된다.

### Virtuoso 오픈소스 버전

#### Virtuoso 설치

<div class="note">

👀 Virtuoso 다운로드: [LINK](https://github.com/openlink/virtuoso-opensource/releases/tag/v7.2.6.1) (7.2.6)

</div>

버투소는 상용 버전과 오픈소스 버전을 제공한다. 데이터 로딩 속도는 체감상 블레이즈그래프보다 느린 느낌이고, 쿼리 속도는 조금 빠른 편이다. 그러나 인덱싱에 따라 쿼리 속도가 상이하게 달라질 수 있다. 오픈소스 버전은 본인의 OS에 맞추어 다운로드 받으면 된다. 맥의 경우 조작이 편한 UI 환경을 제공한다. 버투소도 상당히 잘 정돈된 문서를 제공한다. 오픈소스 버전의 튜토리얼은 [여기](http://vos.openlinksw.com/owiki/wiki/VOS/)에서 볼 수 있다.

![virtuoso](/opensource-graphdb-review/virtuoso.png)

버투소가 설치되면 `start VOS database`를 클릭한다. `http://localhost:8890/conductor/`로 접속하면 버투소 conductor로 접근할 수 있다. 디폴트 계정은 account: `dba`, password: `dba`다.

#### Virtuoso 데이터 업로드

![virtuoso](/opensource-graphdb-review/virtuoso-upload.png)

데이터를 업로드하는 가장 쉬운 방법은 conductor UI 환경을 이용하는 것이다. conductor의 `Web Application Server` 탭을 선택하고, 원하는 경로에 `Upload` 탭을 클릭한다.

#### Virtuoso 쿼리

![virtuoso](/opensource-graphdb-review/virtuoso-query.png)

`SPARQL` 쿼리는 `Linked Data` 탭의 Query 화면에서 할 수 있다. 기본 쿼리창은 `syntax highlighting`이나 네임스페이스 자동완성 기능 등을 제공하지 않아 단독으로 사용하기 매우 불편하다. 다만 모든 데이터를 뽑아오는 쿼리를 실행할 때에는 다른 데이터베이스보다 빠르다. 버투소의 초기 설정은 만 개가 넘는 쿼리 결과를 출력하지 않는다. 따라서 만 개 이상의 쿼리 결과를 출력하고 싶을 때는 `System Admin` 탭에서 `ResultsSetRowsMax` 항목을 삭제해야 한다.

### GraphDB Free 버전

#### GraphDB 설치

#### GraphDB 데이터 업로드

#### GraphDB 쿼리

[^1]: 두 `jar` 파일은 이름만 다를 뿐 제공하는 기능은 동일하다. 다운로드 받는 파일 이름에 따라 접속 url이나 `sparql endpoint`의 경로 등이 달라진다.
[^2]: 도커 이미지의 기본 용량은 10G다. 3억 개의 트리플 데이터를 업로드하기 위해서는 도커 이미지의 기본 용량을 많이 늘려야 한다.
