---
title: 우분투 환경에서 Virtuoso에 named graph로 대용량 데이터 업로드하기
description: 우분투 환경에서 그래프 데이터베이스인 Virtuoso에 named graph로 데이터를 밀어넣는 방법에 대해 알아보자.
author: 박하람
category: Knowledge Graph
datetime: 2023. 12. 05.
language: Korean
featured: None
tags:
  - virtuoso
  - bulk data
  - named graph
---

우분투 서버에 `Virtuoso 7`을 설치하고, 대용량 데이터를 업로드 해야할 일이 생겼다. 우분투에서 `Virtuoso 7`을 설치하는 것은 솜솜 블로그의 [[Virtuoso] Virtuoso 7 버전 설치하기](https://chaeeunsong.tistory.com/entry/Virtuosu-Virtuoso-7-%EB%B2%84%EC%A0%84-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0)를 참고하면 된다. 이 포스팅은 무사히 버투소를 설치한 다음, 대용량의 데이터를 `named graph` 형태로 버투소에 업로드하는 방법을 설명한다.

### 준비 (1): 설정 변경하기

대용량 데이터를 업로드하려면, 여러 우여곡절을 통해 `conf` 파일을 변경해야 한다는 것을 알았다..! `virtuoso.ini` 파일은 `/var/lib/virtuoso-opensource-7/db/virtuoso.ini`에 있다. `virtuoso.ini` 파일에서 아래의 코드를 수정하면 된다.

- `DirsAllowed`: 데이터가 존재하는 디렉토리의 경로를 허용해줘야 데이터 경로가 인식된다. 추가로 데이터가 있는 경로를 작성하면 된다.
- `NumberOfBuffers`와 `NumberOfBuffers`: 머신의 RAM 성능에 따라 지정해주면 된다. 버투소가 RAM 용량에 따라 지정한 버퍼 사이즈는 [여기](https://docs.openlinksw.com/virtuoso/rdfperfgeneral/)에서 확인할 수 있다.
- `MaxCheckpointRemap`: 데이터를 마구 업로드하다가 `checkpoint`로 데이터 저장이 잘 되지 않아서 마구 넣었던 데이터가 날라간 적이 있다. 최대 `checkpoint`로 얼마 정도의 페이지를 넣을지 지정한다.
- `TransactionAfterImageLimit`: 벌크 데이터를 업로드 할 때 transaction 상에서 롤백 에러가 생길 때가 있다. 이렇게 리밋 사이즈를 늘려주면 롤백 에러가 작동하지 않는다. 관련 에러에 대한 버투소의 공식 문서는 [다음](https://vos.openlinksw.com/owiki/wiki/VOS/VirtTipsAndTricksGuideTransactionLogControl)과 같은 설명을 제공한다.

```bash
DirsAllowed = ., /usr/share/virtuoso-opensource-7/vad, /usr/share/proj, {원하는 경로 추가}
NumberOfBuffers          = 5450000
NumberOfBuffers          = 4000000
MaxCheckpointRemap              = 1360000
TransactionAfterImageLimit = 2147483000
```

`virtuoso.ini` 파일이 변경되면, 버투소를 재실행해야 한다. 다음의 경로로 접속해서 버투소를 다시 실행한다.

```bash
cd /var/lib/virtuoso-opensource-7/db
virtuoso-t -f &
```

버투소 서버가 정상 작동한다면, `localhost:8890/conductor/`에서 `conductor` 화면이 보인다. 간혹 버투소 서버의 ini 파일를 변경했는데, 브라우저 상에서 `conductor`가 보이지 않을 때가 있다. 그럴 떄 버투소 포트로 방화벽이 잘 열려있는지 확인하자.

```bash
ufw allow 8890
```

### 준비 (2): global.graph 파일 생성하기

아주 귀찮게도 버투소에 `named graph`로 데이터를 넣으려면, 데이터가 있는 폴더에 `global.graph` 파일을 생성해야 한다. 버투소는 여러 방법을 안내하고 있지만, `global.graph` 파일을 생성하는 것이 가장 쉽다[^1]. 버투소의 설명에 따르면, `global.graph` 파일은 Contains Graph IRI name into which RDF data from any files that do not have a specific graph name file will be loaded 일 때 사용한다. 즉, `global.graph` 파일은 어떤 파일이든 관계 없이 `global.graph` 파일이 있는 경로에 동일한 그래프 IRI로 `named graph`를 생성하고 싶을 때 사용한다.

```bash
http://data.test.com/graph/cow/
```

`vim`으로 `global.graph` 파일을 만들고 위와 같이 `named graph`로 생성할 IRI를 넣어주면 된다. 단, 폴더 경로를 구성할 때 동일한 폴더에 동일한 `named graph`로 넣고 싶은 파일만 있어야 동일한 `named graph`로 생성된다.

### 대용량 데이터 업로드하기

버투소는 `sql` 구문으로 데이터를 업로드할 수 있는 편리한 기능을 제공한다. `isql`은 버투소가 제공하는 `sql` 기반의 쿼리 환경인데, `isql`을 통해 버투소의 설정을 변경할 수도 있다. `isql`은 경로에 상관 없이 다음의 코드를 작성하면 된다.

```bash
isql 1111 dba {비밀번호}
```

`isql`은 포트 1111에서 열리고, 접속할 때 conductor의 계정을 입력해야 한다. 비밀번호를 바꾸지 않았으면, 아이디와 비밀번호는 모두 dba이다. 본인은 비밀번호를 바꾸었기 때문에, 바뀐 비밀번호를 입력한다.

#### 특정 경로에 있는 모든 파일을 업로드하기

데이터가 `home/ubuntu/data/cow` 경로에 있고, `ttl` 파일로 저장되었다면 다음의 코드를 입력하면 된다. 단, `global.graph` 파일에 `http://data.test.com/graph/cow/`와 동일한 그래프 IRI가 작성되어 있어야 한다. `ld_dir` 구문은 버투소에 업로드할 데이터를 `DB.DBA.load_list`에 올리는 작업이다. `ld_dir`에 실행 후 `DB.DBA.load_list`에 해당 경로에 있는 `ttl` 파일이 모두 올라갔는지 확인한다. `rdf_loader_run()`은 버투소에 RDF 데이터를 밀어넣는 함수다. `ll_state`가 0이라면 `rdf_loader_run()`으로 데이터가 업로드되고, `ll_state`가 2라면 데이터가 버투소로 업로드된 항목이다. 마지막으로 `checkpoint()`를 해줘야 RDF 데이터 업로드가 무사히 된다.

```sql
-- 데이터 경로, 파일명, 그래프 IRI 순으로 작성
SQL> ld_dir('/home/ubuntu/data/cow', '*.ttl', 'http://data.test.com/graph/cow/');
SQL> select * from DB.DBA.load_list;
SQL> rdf_loader_run();
SQL> checkpoint();
```

#### 하나의 폴더에 여러 개의 폴더 구조가 있는 데이터 업로드하기

`car`라는 폴더에 `bmw`라는 폴더와 `hyundai`라는 폴더가 있고, 각 폴더에 업로드하고 싶은 `ttl` 파일이 있다면 `ld_dir_all`을 사용하면 된다. 물론 `DB.DBA.load_list`가 해당 목록에 업로드되었는지 확인하고, `rdf_loader_run()`과 `checkpoint()`를 실행해줘야 한다.

```sql
SQL> ld_dir_all('/home/ubuntu/data/car', '*.ttl', 'http://data.test.com/graph/cow/');
```

#### 특정 문자열이 포함된 파일만 업로드하기

`isql`은 `sql`로 할 수 있는 기능을 지원하고 있기 때문에, %과 같은 와일드 카드 문자의 사용이 가능하다. 파일 목록에 '서울'이 들어간 `rdf` 파일만 업로드하고 싶다면, 다음의 코드를 작성하면 된다.

```sql
SQL> ld_dir('/home/ubuntu/data/cow', '%서울%.rdf', 'http://data.test.com/graph/cow/');
```

### 추가: `DB.DBA.load_list`에 목록이 있어도 데이터가 업로드 되지 않는 경우

`DB.DBA.load_list`가 원하는 데이터 항목이 업로드되어 있는데, 실제로 `rdf_loader_run()`을 했을 때 데이터가 업로드되지 않을 때가 있다. `ll_state`가 2인 경우는 `ld_dir` 또는 `ld_dir_all`로 데이터 목록을 업로드해도 `rdf_loader_run()`이 작동하지 않는다. 그럴 때는 `DB.DBA.load_list` 목록에서 해당 데이터 목록을 삭제해줘야 한다. 해당 데이터 목록을 삭제하는 방법은 `sql` 구문과 동일하다. 지우려고 하는 데이터의 Graph IRI가 `http://data.test.com/graph/cow/`라면 `where` 구문으로 조건을 걸어서 해당 행을 삭제해주면 된다.

```bash
SQL> delete from DB.DBA.load_list where ll_graph='http://data.test.com/graph/cow/';
```

### 추가: named graph 삭제하기

`conductor`에서 직접 네임드 그래프를 삭제하는 데에 시간이 꽤 오래 걸린다. `isql`은 코드 기반으로 네임드 그래프를 삭제할 수 있는 기능을 제공한다. `log_enable`에 대한 함수는 정확히 이해하지 못했지만, 자동 커밋 또는 수동 커밋을 설정하는 코드 같다[^2]. 그 다음은 지우고 싶은 graph IRI를 입력하면 버투소에서 해당 네임드 그래프가 삭제된다.

```bash
SQL> log_enable(3,1);
SQL> SPARQL CLEAR GRAPH <http://data.test.com/graph/cow/>;
```

[^1]: https://vos.openlinksw.com/owiki/wiki/VOS/VirtBulkRDFLoader
[^2]: https://docs.openlinksw.com/virtuoso/fn_log_enable/
