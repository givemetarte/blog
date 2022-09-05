---
title: RDFLib를 사용해 데이터세트의 메타데이터를 DCAT으로 표현하기 2️⃣
description: RDFLib로 데이터세트의 메타데이터를 RDF 형식으로 변환해보자. W3C 표준 DCAT으로 데이터세트의 메타데이터를 표현한다.
slug: rdflib-tutorial-dcat-2
author: 박하람
category: Knowledge Graph
datetime: 2022. 09. 02. 20:20
language: Korean
featured: Featured
tags:
  - RDF
  - RDFLib
  - DCAT
  - 지식그래프
---

이 포스트는 시리즈물로, 이전 편 [RDFLib를 사용해 데이터세트의 메타데이터를 DCAT으로 표현하기 1️⃣](/blog/rdflib-tutorial-dcat-1) 에서 이어집니다. 사용한 데이터와 전체 코드는 깃헙 레포에서 공개하고 있습니다.
<div class="note">

👀 전체 코드보기: [rdflib-tutorial](https://github.com/givemetarte/rdflib-tutorial)

</div>

### 데이터 변환하기 

바로 데이터를 변환해보자. 변환을 위해 먼저 필요한 것은 트리플 데이터를 담을 `Graph()`가 필요하다. `bind()`의 역할은 어휘와 접두어를 매핑해주는 역할을 한다. `RDF`를 직렬화하거나 `SPARQL` 쿼리로 파싱할 때 사용되므로, `Graph()`에 본인이 사용할 접두어를 매핑해주는 것이 필요하다.
```py
# generate Graph()
g = Graph()
g.bind("koor", KOOR)
g.bind("dcat", DCAT)
g.bind("dct", DCTERMS)
```

다음은 각 행마다 `RDF`로 변환하는 `for`문을 작성한다. 각 행마다 데이터세트(`dcat:Dataset`)와 배포(`dcat:Distribution`)에 대한 URI가 정의된다. URI 규칙은 아래 표와 같이 정의한다. 

| 유형 | URI의 id 값 | 예시 |
| :--: | :--: | :--: |
| `dcat:Dataset` | ds-{목록키} | http://data.datahub.kr/id/dcat/ds-15000000 |
| `dcat:Distribution` | dt-{목록키} | http://data.datahub.kr/id/dcat/dt-15000000 |
| `koor:Organization` | {기관코드} | http://data.datahub.kr/id/organization/5670000 |

```py
for idx, row in tqdm(data.iterrows(), total=data.shape[0]):
    # base id 
    cat_core_uri = URIRef(dcat_id + "national-cord-data-catalog") # 국가중점데이터 카탈로그 URI
    cat_stan_uri = URIRef(dcat_id + "standard-data-catalog") # 표준데이터 카탈로그 URI
    ds_uri = URIRef(dcat_id + "ds-" +row["목록키"])
    dist_uri = URIRef(dcat_id + "dt-" + row["목록키"])
    orga_uri = URIRef(koor_id + row["기관코드"])
```

다음은 각 URI의 유형(`rdf:type`)을 선언한다. 마지막 줄은 `dcat:Dataset`와 연결된 `dcat:Distribution`을 `DCAT:distribution`으로 연결한다. 즉, 데이터세트에 해당하는 배포와 `dcat:distribution`으로 연결된다. 
```py
for idx, row in tqdm(data.iterrows(), total=data.shape[0]):
    ...
    # define uri type
    g.add((cat_core_uri, RDF.type, DCAT.Catalog))
    g.add((cat_stan_uri, RDF.type, DCAT.Catalog))
    g.add((ds_uri, RDF.type, DCAT.Dataset))
    g.add((dist_uri, RDF.type, DCAT.Distribution))
    g.add((ds_uri, DCAT.distribution, dist_uri))
```

다음은 국가중점데이터와 표준데이터에 해당되는 데이터세트를 각 카탈로그와 연결하는 코드다. '국가중점여부'와 '표준데이터여부' 컬럼이 Y인 경우, 카탈로그에 포함된 데이터세트 표현을 위해 `dcat:dataset`으로 연결한다.
```py
for idx, row in tqdm(data.iterrows(), total=data.shape[0]):
    ...
    # dataset in catalog
    if row["국가중점여부"] == "Y":
        g.add((cat_core_uri, DCAT.dataset, ds_uri))
    
    if row["표준데이터여부"] == "Y":
        g.add((cat_stan_uri, DCAT.dataset, ds_uri)) 
```

다음은 카탈로그와 데이터세트의 메타데이터를 표현하는 코드다. 카탈로그는 메타데이터가 제공되지 않으므로 간단하게 제목만 변환한다. 데이터세트는 `DCAT`의 정의에 맞는 속성을 부여한다. 유의할 점은 `dct:publisher`의 공역이 URI로 표현된 기관이고[^1], 기관명은 기관 URI의 `rdfs:label`로 표현했다. 
```py
for idx, row in tqdm(data.iterrows(), total=data.shape[0]):
    ...
    # catalog metadata
    cell(g, cat_core_uri, DCTERMS.title, "국가중점데이터 목록")
    cell(g, cat_stan_uri, DCTERMS.title, "표준데이터 목록")

    # dataset metadata
    cell(g, ds_uri, DCTERMS.title, row["목록명"], lang="ko")
    cell(g, ds_uri, DCTERMS.description, row["목록설명"], lang="ko")
    uri(g, ds_uri, DCTERMS.publisher, row["기관코드"], objClass=KOOR.Organization, objURI=koor_id)
    cell(g, orga_uri, RDFS.label, row["기관명"], lang="ko")
    cell(g, ds_uri, DCTERMS.issued, row["목록 등록일"], datatype=XSD.date)
    cell(g, ds_uri, DCTERMS.modified, row["목록 수정일"], datatype=XSD.date)
    cell(g, dist_uri, DCAT.accessURL, row["목록 URL"], datatype=XSD.anyURI)
```

### 변환된 결과 저장하기

`RDF`로 변환된 데이터는 모두 `Graph()`에 저장되고, `Graph()`에 담긴 트리플 개수를 확인할 수 있다. 
```py
# the number of triples
print(f"총 {len(g)} 개의 트리플이 있습니다.")
```
```bash
총 576197 개의 트리플이 있습니다.
```
총 63,468개의 데이터세트는 576,197개의 트리플로 변환되었다. 변환된 트리플 데이터는 `turtle` 형식으로 저장할 수 있다[^2]. 

```py
# save as ttl
g.serialize(destination=f"data/data-go-kr-metadata-dcat.ttl", format="ttl")
```
변환에서부터 저장까지 소요된 시간은 약 41초다. (데이터를 저장하는데 시간이 꽤 걸린다.)

### SPARQL 질의하기 

`RDF` 데이터는 질의를 위해 `SPARQL`을 사용한다. 공공데이터포털의 데이터세트가 잘 변환되었는지 확인하기 위한 질의를 해보자. 질의문 4가지로 데이터가 잘 변환되었는지 확인해보았다. 

#### Q1. 데이터세트 개수 구하기 

```py
query = """
SELECT (COUNT(DISTINCT ?dataset) AS ?dataset_count)
WHERE { 
    ?dataset a dcat:Dataset .
}
"""
result = g.query(query)
for row in result:
    print(f"고유한 데이터세트의 개수는 {row.dataset_count}개입니다.")
```
```bash
고유한 데이터세트의 개수는 63468개입니다.
```

#### Q2. 카탈로그별 데이터세트 개수 구하기
```py
query = """
SELECT ?title (COUNT(DISTINCT ?dataset) AS ?dataset_count)
WHERE { 
    ?catalog a dcat:Catalog ;
        dcat:dataset ?dataset ;
        dct:title ?title .
} GROUP BY ?catalog
"""
result = g.query(query)
for row in result:
    print(f"{row.title}의 데이터세트 개수는 {row.dataset_count}개입니다.")
```
```bash
표준데이터 목록의 데이터세트 개수는 147개입니다.
국가중점데이터 목록의 데이터세트 개수는 2847개입니다.
```

#### Q3. 데이터세트의 메타데이터 확인하기
```py
query = """
SELECT DISTINCT ?dataset ?title ?orgName ?issued ?modified ?accessURL
WHERE { 
    ?dataset a dcat:Dataset ;
        dct:title ?title ;
        dct:publisher ?orgURI ;
        dct:issued ?issued ;
        dct:modified ?modified ;
        dcat:distribution ?distribution .
    ?orgURI rdfs:label ?orgName .
    ?distribution dcat:accessURL ?accessURL .
} LIMIT 5
"""
result = g.query(query)
for row in result:
    print(row.dataset, row.title, row.orgName, row.issued, row.modified, row.accessURL)
```
```bash
http://data.datahub.kr/id/dcat/ds-15087138 한국법제연구원_세계법령정보사이트DB 한국법제연구원 2021-09-02 2021-09-03 https://www.data.go.kr/data/15087138/fileData.do
http://data.datahub.kr/id/dcat/ds-15033949 한국남부발전(주)_설계기술용역 시공도급계약 현황(삼척) 한국남부발전(주) 2021-03-19 2022-03-07 https://www.data.go.kr/data/15033949/fileData.do
http://data.datahub.kr/id/dcat/ds-15086818 대구광역시_(비정형데이터)2021년 대구시 화보집4 대구광역시 2021-08-30 2021-08-30 https://www.data.go.kr/data/15086818/fileData.do
http://data.datahub.kr/id/dcat/ds-15064648 건강보험심사평가원_보건의료빅데이터개방시스템_의료급여진료통계 건강보험심사평가원 2020-09-15 2021-09-22 https://www.data.go.kr/data/15064648/fileData.do
http://data.datahub.kr/id/dcat/ds-15090954 강원도 원주시_원주시청홈페이지 관광포털메뉴 강원도 원주시 2021-09-29 2021-09-29 https://www.data.go.kr/data/15090954/fileData.do
```

#### Q4. 데이터세트를 제공하는 상위 10개 기관 구하기
```py
query = """
SELECT ?orgName (COUNT(DISTINCT ?dataset) AS ?dataset_count)
WHERE { 
    ?dataset a dcat:Dataset ;
        dct:publisher ?org .
    ?org rdfs:label ?orgName .
} GROUP BY ?org
ORDER BY DESC(?dataset_count)
LIMIT 10
"""
result = g.query(query)
for row in result:
    print(f"{row.orgName}의 데이터세트 개수는 {row.dataset_count}개입니다.")
```
```bash
서울특별시의 데이터세트 개수는 2460개입니다.
제주특별자치도의 데이터세트 개수는 1289개입니다.
동북아역사재단의 데이터세트 개수는 1028개입니다.
경기도의 데이터세트 개수는 1015개입니다.
대전광역시의 데이터세트 개수는 991개입니다.
국토교통부의 데이터세트 개수는 955개입니다.
인천광역시의 데이터세트 개수는 780개입니다.
행정안전부의 데이터세트 개수는 779개입니다.
경상남도의 데이터세트 개수는 758개입니다.
국가철도공단의 데이터세트 개수는 749개입니다.
```

두 편에 걸쳐 `RDFLib`로 지식그래프 만드는 방법을 진행했다. 본인은 두 편에 지식그래프를 만드는 방법을 소개하기 위해 설명을 많이 생략했다. 불친절한 포스트이지만, 파이썬으로 데이터를 가공하고 지식그래프로 변환하기 위한 방법을 담았다. 이해가 가지 않거나 설명이 부족한 부분에 대해 질문은 언제나 환영한다! 🥰


### 번외 : 공공데이터포털의 `DCAT` 메타데이터의 품질은?

공공데이터포털은 데이터 상세 페이지에서 `schema.org`와 `DCAT`의 메타데이터 다운로드를 지원한다. 아래 그림은 공공데이터포털에서 제공하는 `DCAT` 표현의 예시다. 결론부터 말하자면, 공공데이터포털의 `DCAT` 표현은 엉터리다. 

이전 편에서 데이터를 파악할 때 중요하게 점검한 부분은 데이터세트의 식별자를 찾는 작업이다. '목록키'는 데이터세트를 식별할 수 있는 값으로, `dcat:Dataset`의 `URI` 값으로 사용되었다. 그런데 공공데이터포털은 `dcat:Dataset`에 대한 고유한 `URI`가 없다! 기관(`foaf:Organization`)이나 배포(`dcat:Distribution`), 분류체계(`dcat:theme`) 등과 같이 고유한 `URI` 값이 부여되어야 하지만, 부여된 것은 아무것도 없다. 

더 재미있는 것은 `DCAT`은 `XML`이 아닌 `RDF`로 표현되어야 한다는 사실..🥲

![공공데이터포털 DCAT 예시](/rdflib-tutorial-dcat/fig2.png)


[^1]: `DCAT`은 `dct:publisher`의 공역으로 `foaf:Agent`을 정의하고 있다. `koor:Organization`은 한국 행정기관에 대한 어휘를 생성한 것으로, `foaf:Organization`을 `rdfs:subClassOf`로 선언해주면 사용가능하다. 
[^2]: `RDFLib`가 지원하는 직렬화 형식은 [링크](https://rdflib.readthedocs.io/en/stable/plugin_serializers.html)에서 확인할 수 있다.