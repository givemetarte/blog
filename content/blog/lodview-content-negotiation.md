---
title: LodView로 지식그래프의 URI 역참조 지원하기 (feat. Redirect & Content Negotiation)
description: LodView는 URI의 역참조를 지원하는 자바 기반의 웹 어플리케이션으로, 구축한 RDF 데이터를 웹 화면에서 볼 수 있게 해준다. LodView의 사용 방법과 함께 웹 서버에서 리다이렉트와 내용 협상을 지원하는 방법도 알아보자.
slug: lodview-content-negotiation
author: 박하람
category: Knowledge Graph
datetime: 2023. 12. 07.
language: Korean
featured: None
tags:
  - LodView
  - content negotiation
  - nginx
  - knowledge graph
  - virtuoso
---

LodView는 웹 상에서 RDF로 구축된 데이터를 볼 수 있게하고, URI의 역참조를 지원하는 오픈소스 웹 어플리케이션이다. URI 역참조를 지원하는 비슷한 어플리케이션이 많았지만, 대부분은 개발이 중단된 상태이다. 대표적으로 사용할 수 있는 오픈소스 어플리케이션이 [LodView](https://github.com/LodLive/LodView)와 [Zazuko의 trifid](https://github.com/zazuko/trifid)다. 그 중 오늘 설명한 LodView는 그래프 스토어인 버투소에 가장 최적화된 어플리케이션으로, 특별한 자바 지식이 없어도 사용할 수 있다. 단! 그래프 스토어가 버투소가 아니라면 LodView는 사용하기 어렵다!!! 이 포스팅은 그래프 스토어로 버투로슬 사용할 때 LodView를 실행하는 방법부터 Nginx로 URI에 대한 내용 협상 (Content Negotiation)을 지원하는 방법에 대해 알아본다.

### LodView 소스코드 다운로드 받기

[LodView의 깃헙 레포지토리](https://github.com/LodLive/LodView/releases/tag/v1.2.1)에서 2017년 릴리즈된 소스 코드 (버전 1.2.1)를 다운로드 받는다. 다운로드 받은 폴더에 들어가 다음의 코드를 작성한다.

```bash
# 실행한 자바 버전: openjdk version "11.0.21"
# maven이 설치되지 않았다면, maven도 함께 설치하자
mvn compile war:war
mvn jetty:run
# background에서 실행
nohup mvn jetty:run &
```

무사히 컴파일되고 정상적으로 실행이 된다면, `http://localhost:8080/lodview/`에서 아래와 같은 페이지가 보인다. 만약 특정 ip에서 작업 중이라면 해당 포트의 방화벽을 열지 않았는지 확인해보자 (`ufw allow 8080`).

![LodView Homepage](/lodview-content-negotiation/lodview-homepage.png)

#### `mvn jetty:run` 실행시 에러 해결

다음과 같이 이런 에러가 생긴다면, `git clone`으로 해당 레포를 그대로 복제해온 코드를 실행했을 가능성이 높다.

```
 Failed startup of context o.e.j.m.p.JettyWebAppContext@52bf7bf6
 {/lodview,file:/xxxx/xxxx/xxxx/LodView/src/main/webapp/,STARTING}
 {file:/xxxx/xxxx/xxxx/LodView/src/main/webapp/}
org.eclipse.jetty.util.MultiException: Multiple exceptions

```

해당 에러는 `mvn`이나 `jetty`의 버전이 맞지 않아서 생길 수 있다고 하는데... 적절한 해결방법이 없어서 2017년에 release된 버전 1.2.1의 소스코드를 다운받아 실행하면 잘 작동한다.

### LodView의 설정 변경하기

LodView의 화면이 무사히 뜬다면, LodView의 설정을 바꿔주어야 한다. LodView의 위키는 IRI의 방식에 따라 어떻게 redirection & content negotiation 할 것인지 설명을 제공한다 [^1]. Use Case 3이 dbpedia의 URI에 대해 내용 협상하는 방법인데, 내가 구축한 지식그래프의 URI 패턴과 가장 유사해서 도움이 많이 됐다.

구축한 URI의 패턴이 다음과 같다고 하자. (임의로 구성한 URI다.)

- http://data.test.com/id/car/12345678
- http://data.test.com/id/train/12345678

위와 같은 URI 패턴은 다음과 같이 `conf.ttl` 파일을 수정하면 된다. `conf:endpoint`는 버투소 이외의 그래프 스토어의 엔드포인트를 작성하면 정상적으로 잘 작동이 안된다.

```ttl
# conf 파일 경로: LodView/src/main/webapp/WEB-INF/conf.ttl
conf:IRInamespace <http://data.test.com/> ;
conf:endpoint <http://xxx.xxx.xxx.xx:8890/sparql> ;
conf:httpRedirectSuffix "";
conf:redirectionStrategy "pubby";
conf:publicUrlPrefix <http://data.test.com/>;
conf:staticResourceURL <auto>
```

다시 `mvn compile`을 수행하고 `jetty:run`을 한다면 정상적으로 작동할 것이다. SPARQL 엔드포인트가 LodView과 잘 연결됐는지 확인하려면 `http://localhost:8080/lodview/id/car/12345678/`으로 접속하면 된다. LodView의 기본 경로가 `http://localhost:8000/lodview/`이기 때문에 도메인을 제외한 URI의 경로는 `/lodview/` 다음에 붙게 된다.

### Nginx로 리다이렉트와 내용 협상 지원하기

직접 도메인에 붙은 경로로 LodView가 작동하려면, 웹 서버 단에서 리다이렉트와 내용 협상을 설정해줘야 한다. 내가 지식그래프 서비스를 제공할 서버의 구성은 다음의 그림과 비슷하다. URI가 `http://data.test.com/id/car/12345678`인 사례로 리다이렉트를 설명한다. `http://data.test.com/id/car/12345678`가 포함된 데이터는 server1에 있다고 가정해보자.

![nginx proxy server](/lodview-content-negotiation/nginx-proxy-pass.png)

1. 브라우저에서 프록시 서버로 요청 전달

브라우저에서 `http://data.test.com/id/car/12345678`이란 URI를 입력한다면, 먼저 `data.test.com`의 도메인이 부여된 프록시 서버로 요청이 전달된다. 나의 경우, 프록시 서버에 `data.test.com`이란 도메인이 부여된 웹 서버 (nginx)를 운영하고 있다. (정확히는 프록시 서버를 운영한다기 보다 프록시 서버의 역할을 하는 서버가 있다.)

2. URI의 경로에 따라 해당 데이터가 있는 서버로 이동

프록시 서버는 URI의 경로에 따라 실제 데이터가 존재하는 서버로 리다이렉트 해줘야 한다. 예를 들어, `/id/car/` 경로를 가진 URI는 server1로, `/id/train/` 경로를 가진 URI는 server2로, `/id/airplane/` 경로를 가진 URI는 server3로 보낸다고 가정해보자. 이 경우는 프록시 서버의 nginx에서 다음과 같이 설정을 해줘야 한다.

```nginx
server {
    server_name data.test.com www.data.test.com;

    ...

    location /id/car/ {
        proxy_pass http://xxx.xxx.xx.x1:8080/lodview/id/car/ ;
    }

    location /id/train/ {
        proxy_pass http://xxx.xxx.xx.2:8080/lodview/id/train/ ;
    }

    location /id/airplane/ {
        proxy_pass http://xxx.xxx.xx.3:8080/lodview/id/airplane/ ;
    }
}
```

`data.test.com`에 대한 설정이 부여된 conf 파일에서 URI의 경로별로 `location`을 설정한다. 예를 들어, `data.test.com` 다음에 `/id/car/`이란 경로가 오는 URI는 server1의 LodView로 프록시 패스한다. server1과 server2, server3에서 LodView가 개별적으로 실행되고 있으면 된다.

이렇게 nginx까지 설정해줬다면, HTML 형태로 지식그래프로 구축된 데이터를 확인할 수 있다. 예를 들어, `http://data.test.com/id/car/12345678/`를 브라우저에 검색하면 LodView의 `http://xxx.xxx.xx.x1:8080/lodview/id/car/12345678/` 경로로 무사히 리다이렉트된다!

[^1]: https://github.com/LodLive/LodView/wiki/how-to:-redirection-and-content-negotiation
