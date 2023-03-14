---
title: 그래프 데이터베이스 Blazegraph, Virtuoso, GraphDB 설치와 데이터 업로드
description: 오픈소스 그래프 데이터베이스 blazegraph, graphdb, virtuoso의 오픈소스 버전을 설치하고, 데이터를 업로드 해보자. 더불어 업로드된 데이터를 SPARQL로 질의해보자.
slug: opensource-graphdb-review
author: 박하람
category: Knowledge Graph
datetime: 2021. 12. 24.
language: Korean
featured: None
tags:
  - 지식그래프
  - 트리플스토어
  - blazegraph
  - virtuoso
  - graphdb
  - sparql
---

오픈소스 또는 무료 버전의 Blazegraph, Virtuoso와 GraphDB를 설치하고, 트리플 데이터를 업로드해보자. 그래프 데이터베이스에서 제공하는 `SPARQL` 쿼리 기능도 사용해보자. 개발환경은 MacOS 기반이며, `Java 14.0.2` 버전으로 테스트했다.

### Blazegraph 오픈소스 버전

#### Blazegraph 설치

<div class="note">

👀 Blazegraph 다운로드: [LINK](https://github.com/blazegraph/database/releases/tag/BLAZEGRAPH_2_1_6_RC) (2.1.6)

</div>

Blazegraph는 오픈소스로 개발된다. 가장 많이 사용하고 잘 알려져 있는 그래프 데이터베이스 중 하나다. 대표적으로 위키데이터와 AutoDesk 등이 Blazegraph를 사용한다. 사용자가 많다보니 커뮤니티가 잘 형성되어 있고, 관련 영어 게시글을 찾는 것이 어렵지 않다.(물론 한국어로 된 글은 찾기 어렵다 🥲) 설치 방법과 제공 기능은 Blazegraph의 [Github Wiki](https://github.com/blazegraph/database/wiki)에 잘 정리되어 있다.

```bash
$ java -server -Xmx4g -jar blazegraph.jar
```

Blazegraph를 다운로드하는 가장 쉬운 방법은 Github에서 배포하는 `bigdata.jar` 또는 `blazegraph.jar` 파일을 원하는 폴더 경로에 다운받으면 된다[^1]. 물론 자바가 컴퓨터에 깔려있어야 하고, `Java 8`에서 안정적으로 작동한다. [도커 이미지](https://github.com/lyrasis/docker-blazegraph)로도 다운로드 가능하다. 터미널 환경에서 아래 코드를 실행하면 `http://localhost:9999`에서 blazegraph workbench 화면이 보인다.

![Blazegraph namespace](/opensource-graphdb-review/blazegraph-namespace.png)

Blazegraph는 기본적으로 `kb`라는 네임스페이스를 사용한다. 새로운 네임스페이스를 생성하려면, `NAMESPACES` 탭에서 원하는 이름으로 네임스페이스를 생성한다. 해당 네임스페이스를 사용하기 위해서는 반드시 `Use`를 눌러 `In use` 상태로 바꿔야 한다.

#### Blazegraph 데이터 업로드

![Blazegraph update](/opensource-graphdb-review/blazegraph-update.png)

데이터를 업로드하는 가장 쉬운 방법은 `UPDATE` 탭의 하단에 `.rdf`나 `.ttl` 파일을 드래그하는 것이다. 200MB 이상의 파일은 파일 경로를 입력하여 데이터를 업로드하면 된다.

#### Blazegraph 쿼리

![Blazegraph query](/opensource-graphdb-review/blazegraph-query.png)

데이터가 잘 업로드 되었는지 확인하기 위해 `SPARQL` 질의를 해보자. `QUERY` 탭에서 `SPARQL` 구문으로 질의할 수 있다. 기본적으로 `syntax highlighting` 기능을 제공하며, Namespace shortcuts에서 원하는 네임스페이스를 추가할 수 있다. 참고로 데이터를 저장했을 때 사용한 네임스페이스를 사용해야 데이터를 쿼리할 수 있다.

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

<div class="note">

👀 GraphDB Free 다운로드: [LINK](https://graphdb.ontotext.com/) (2.1.6)

</div>

GraphDB는 내가 가장 좋아하는 그래프 데이터베이스다. 그래프 데이터베이스를 사용하기 편한 환경을 제공할 뿐만 아니라 각 노드들 간의 관계를 시각적으로 확인할 수 있는 Visualization 기능을 제공한다. 위의 링크를 따라가면 회원가입 후 GraphDB를 다운받을 수 있는 라이센스를 이메일로 받을 수 있다. GraphDB의 워크벤치는 `http://localhost:7200/`에 접근하면 된다.

#### GraphDB 데이터 업로드

![graphdb upload](/opensource-graphdb-review/graphdb-upload.png)

GraphDB에 데이터를 업로드하기 위해서는 먼저 `Repository`를 생성해야 한다. 왼쪽 `Setup` 탭의 `Repositories`에서 새로운 레포지토리를 만든다. `Import` 탭의 `RDF`에서 원하는 레포지토리에 3가지 방식으로 데이터를 업로드할 수 있다. 가장 간단한 방법은 200MB 이하의 RDF 파일을 업로드하는 것이다.

200MB 이상의 데이터를 업로드할 경우, GraphDB의 `SPARQL ENDPOINT`로 데이터를 업로드해야 한다. 업로드할 데이터가 있는 폴더로 이동하여 터미널에서 아래의 코드를 입력한다. ttl 형식으로 업로드할 경우 아래의 형식을 입력하고, rdf 등과 같이 다른 형식으로 업로드한다면 적절한 content-type으로 바꿔야 한다. `{repository-id}`는 레포지토리 이름을 입력하면 된다.

```bash
curl -X POST -H "Content-Type:application/x-turtle" -T {파일이름}.ttl \
  http://localhost:7200/repositories/{repository-id}/statements
```

![graphdb upload](/opensource-graphdb-review/graphdb-index.png)

데이터를 더 빠르게 쿼리할 수 있도록 자동 인덱스 기능을 활용하는 것이 좋다. `Autocomplete`에서 해당 레포지토리의 상태를 `ON`으로 바꾸어준다. 변경사항이 생긴다면 `Build Now`를 눌러 다시 자동 인덱싱을 생성해주면 된다.

#### GraphDB 쿼리

![graphdb query](/opensource-graphdb-review/graphdb-query.png)

GraphDB의 쿼리 기능은 가장 유용하고 다양한 기능을 제공한다. `syntax highlighting`과 네임스페이스 자동완성 뿐만 아니라 쿼리 결과를 테이블이나 json, google chart 등의 형태로도 저장할 수 있다. prefix를 자동으로 상단에 완성 시켜주는 기능은 아주 훌륭하다.

#### GraphDB 시각화

![graphdb viz](/opensource-graphdb-review/graphdb-viz.png)

GraphDB의 가장 유용한 기능이 바로 시각화다. 데이터를 트리플로 변환하는 과정에서 id가 잘 생성되었는지, 또는 원하는 클래스로 type이 잘 부여되었는지 확인하는 것이 필요하다. 그 때 유용한 기능이 바로 `Visual graph`다. `rdfs:label` 또는 `URI` 기준으로 검색이 가능하며, 서로 간의 연결관계를 확인할 수 있다. 예시에서 보이듯, `서울특별시` 노드를 클릭하면 오른쪽에 그래프로 변환한 속성들이 모두 검색된다.

### 끝으로

그래프 데이터베이스 3종의 설치와 데이터 업로드, 쿼리 기능을 살펴보았다. 설치는 어렵지 않으나, 다량의 데이터를 업로드하는 과정은 쉽지 않다. 대략 3억 개의 트리플 데이터를 업로드한 결과, 충분히 오픈소스 버전으로도 데이터를 올리는 것은 가능하지만 인덱싱 성능에 따라 쿼리 속도는 상이할 수 있다. 개인적으로 Blazegraph와 Virtuoso는 대규모 프로젝트에 많이 사용하는 만큼 오픈소스 버전도 사용하기 나쁘지 않다고 생각한다. GraphDB는 트리플 데이터가 잘 변환되었는지 시각적으로 점검할 때 유용하게 사용하고 있다.

[^1]: 두 `jar` 파일은 이름만 다를 뿐 제공하는 기능은 동일하다. 다운로드 받는 파일 이름에 따라 접속 url이나 `sparql endpoint`의 경로 등이 달라진다.
