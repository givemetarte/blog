---
title: docker-compose build할 때 생전 보지 못한 에러를 만났을 때
description: AWS EC2에 docker-compose up만 하면 되는데... 그게 안될 때 만났던 에러를 해결해보자.
slug: ubuntu-docker-compose-error
author: 박하람
category: Web Development
datetime: 2023. 01. 13.
language: Korean
featured: Featured
tags:
  - AWS EC2
  - Ubuntu
  - docker-compose error
---

로컬에서 개발하는 서비스를 모두 다 docker-compose로 만들어놓고, production 서버에다가 마지막으로 deploy만 하면 되는 상황이었다. 데모일까지 거의 삼일 정도 남아서, 여유있게 생각했더니 docker-compose up이 AWS EC2 우분투 서버에서 작동하지 않았다. 온갖 에러를 다 마주쳤는데, 그 에러의 8할은 EC2의 메모리와 용량 문제와 좀 특이한 에러였다. 기본적으로 로컬에서 잘 돌아가는데, EC2에서 잘 안돌아가는 이유는 EC2의 성능이 로컬만큼 좋지 않기 때문이다. 엘라스틱 서치를 돌리는데 t2.large는 함께 돌아가고 있는 다른 어플리케이션이 돌아가지 않을 정도로 작은 사이즈라는 것을 알게 됐다. 결국 t2.2xlarge로 늘리고 웬만한 에러는 해결했는데 `error getting credentials - err: exit status 1` 에러가 계속해서 떴다.

### 에러 해결하기

아래와 비슷한 에러였는데, 계속해서 `docker-compose up`을 하면 `error getting credentials` 하면서 정상적으로 컴포즈가 작동하지 않았다. 구글링하면서 찾아본 결과 유사한 사례가 바로 [이 사례](https://github.com/docker/docker-credential-helpers/issues/60)였다. 이전 에러가 `docker-compose`의 버전 때문에 작동하지 않아서 최신 버전으로 `docker-compose`를 업데이트했다. 이 패키지가 업데이트 될 때, `golang-docker-credential-helpers`도 함께 설치된다.

```bash
error getting credentials - err: exit status 1, out: Error spawning command line 'dbus-launch --autolaunch=d7159335070ef1c0854c75de55c8f588 --binary-syntax --close-stderr': Child process exited with code 1
```

위의 에러는 `golang-docker-credential-helpers`를 제거하니 해결됐다.

```bash
sudo apt remove golang-docker-credential-helpers
```

위와 같이 `golang-docker-credential`을 제거해주고, `docker-compose up`을 해주면 정상적으로 작동한다.
