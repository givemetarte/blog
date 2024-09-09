---
title: Ubuntu 20.04 버전에 고정 IP 부여하기 (ping이 잘 동작하지 않을 때)
description: Ubuntu 20.04 버전을 새로운 서버에 설치하고 고정 IP를 부여하는 방법에 대해 알아보자. 특히, ping 8.8.8.8이 되지 않았던 오류를 해결한 방법을 설명한다.
slug: ubuntu-ip-setting
author: 박하람
category: Linux&Docker
datetime: 2024. 09. 02.
language: Korean
featured: None
tags:
  - ubuntu
  - gateway
---

새로운 서버에 Ubuntu 20.04 버전을 설치하고 기본적인 환경설정을 진행했다. 고정 IP를 부여하고, ssh 접속 설정 등의 다양한 환경세팅을 했는데... 그 중에서 고정 IP 부여가 가장 골칫거리였다. 여러 번 해봐서 이번엔 빠르게 할 수 있겠지 했는데, 오류를 해결하는 데 꼬박 하루가 걸렸다. ChatGPT와 Claude에게 물어봐 해결한 고정 IP 부여 방법을 소개한다.

### 고정 IP 설정

고정 IP는 Ubuntu를 설치할 때부터 부여할 수도 있지만, 설치된 후에도 부여가 가능하다. 다음의 config 파일에서 IP 설정이 가능하다.

```bash
vim /etc/netplan/00-installer-config.yaml
```

초기 세팅은 다음과 같다.

- 기본으로 설정되는 네트워크 인터페이스의 이름은 `eno1`이다.
- `dhcp4`와 `dhcp6`의 `no`는 IPv4와 IPv6에 대해 DHCP를 사용하지 않는다는 의미다. 즉, IP 주소를 자동으로 할당받지 않고 수동으로 설정하겠다는 의미다.
- `addresses`에서 고정 IP를 작성하고, `/24`로 서브넷 마스크를 작성한다.
- `gateway4`는 IPv4 트래픽에 대한 기본 게이트웨이 주소다. 이 IP는 허브의 IP 주소를 입력해줬다.
- `nameservers`는 DNS 서버다. `8.8.8.8`은 구글의 DNS 서버이고, `gateway4`에 작성한 IP도 같이 적어줬다.

```yml
network:
  ethernets:
    eno1:
      dhcp4: no
      dhcp6: no
      addresses:
        - ***.***.114.**/24
      gateway4: ***.***.115.***
      nameservers:
        addresses: [8.8.8.8, ***.***.115.***]
        search: []
  version: 2
```

이렇게 설정하고 `sudo netplan apply`를 한 다음, `ping 8.8.8.8`을 날렸는데 응답을 받지 못했다. 처음엔 게이트웨이의 IP 주소와 고정 IP가 동일한 114 또는 115로 있지 않아서 문제일까 생각했는데, 다른 서버는 이렇게 설정해도 잘 작동하고 있었다.

### 문제 해결: 서브넷 마스크 변경

수많은 블로그 글과 ChatGPT, Claude에 검색한 결과를 실행해 봤지만, 도무지 되지 않았다. 그러다 같이 오류를 해결한 솜솜이 Claude에게 얻은 답변 중 서브넷 마스크를 더 넓게 설정하라는 방안이 있었다. 즉, 24로 설정한 서브넷 마스크를 22로 설정하는 방법인데, 다음과 같이 다른 것은 동일하게 두고 22로 서브넷 마스크만 변경했더니 `ping`이 잘 동작했다!

```yml
network:
  ethernets:
    eno1:
      dhcp4: no
      dhcp6: no
      addresses:
        - ***.***.114.**/22
      gateway4: ***.***.115.254
      nameservers:
        addresses: [8.8.8.8, ***.***.115.254]
        search: []
  version: 2
```

이 분야와 관련해 지식이 거의 없기 때문에 ChatGPT에게 이유를 물어보았다. 문제의 핵심은 게이트웨이와 서브넷의 범위가 불일치 했다는 데에 있었다.

- `/24` 서브넷 (255.255.255.0): `***.***.114.**/24`는 `***.***.114.0`부터 `***.***.114.255`까지의 IP 주소 범위를 포함한다. 게이트웨이는 114가 아닌 115라 서브넷의 범위에 있지 않았기 때문에 네트워크로 인식하지 못했다.

- `/22` 서브넷 (255.255.252.0): `***.***.112.0`부터 `***.***.115.255`까지의 IP 주소 범위를 포함한다. 게이트웨이는 `115.254`이므로 서브넷의 IP 주소 범위에 포함되고, 같은 네트워크의 범위로 포함된다.

결과적으로 이 설정은 네트워크 트래픽이 게이트웨이를 통해 정상적으로 외부로 나가 정상적으로 외부 IP 주소의 `ping`이 동작하게 되었다. 추가적으로 `/23`으로 설정해도 정상작동한다(`***.***.114.1`부터 `***.***.115.254`까지).