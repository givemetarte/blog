---
title: 효과적으로 논문을 관리하기 위한 Zotero 커스터마이징
description: Zotero는 논문 서지를 관리하는 오픈소스 소프트웨어로, 다양한 플러그인이 개발되어 있다. Zotero 7과 다양한 플러그인으로 논문을 효율적으로 읽고 정리하는 방법에 대해 알아보자.
slug: zotero-setting
author: 박하람
category: ETC
datetime: 2024. 04. 03.
language: Korean
featured: None
tags:
  - zotero
  - plugin
  - zotero-style
  - zotero-pdf-translate
  - zotero-actions-tag
---

오랜기간 동안 논문 서지를 관리하는 프로그램에 정착하지 못했다. 서지 프로그램을 선택할 때, 나의 우선순위는 다음과 같았다.

- 논문이 읽고 싶은 만큼 이쁜 디자인을 갖고 있느냐?
- 웹에서 바로 논문을 서지관리 프로그램으로 넣을 수 있느냐?
- 데스크탑과 아이패드 사이에 연동이 잘되나?

무엇보다 논문은 의식적으로 읽으려 하지 않으면 잘 안 읽히기 때문에... 프로그램의 UI가 이쁘기라도 해야했다. 맥에 맞는 훌륭한 UI를 갖고 있는 Papers 3를 써봤지만, 월간 구독이었기 때문에 구독은 포기했다. Zotero는 앞서 언급한 3가지의 기준을 만족하면서, webDAV로 무료로 사용할 수 있는 방법도 있기 때문에 Zotero에 정착했다!

### Zotero 꾸미기

짜잔✨ 베타 버전으로 제공되는 Zotero 7을 커스터마이징한 결과는 다음과 같다. Zotero 7은 못생긴 Zotero 6과 달리 이쁜 화이트 배경의 UI를 제공한다(다크 모드도 제공한다)! 베타라도 안정적으로 맥에서 작동하고 있다. 내가 좋았던 새롭게 추가된 기능은 PDF preview 기능이다. 열심히 읽은 논문인지 아닌지 스킴이 가능해졌다. 이 외에 목록에 보이는 Status, Rating, Remark는 개인적으로 가장 중요하게 생각했던 기능인데, 플러그인으로 쉽게 구성할 수 있다. 아래 모습과 같이 만들기 위해 커스터마이징을 한 방법을 소개한다.

![final zotero view](/zotero-setting/final-view.png)

### WebDAV로 용량 늘리기

Zotero는 일정 용량이 넘으면 구독해야 하는데, 무료로 용량을 늘릴 수 있는 방법이 있다. WebDAV로 개인 저장용량에 연결하면 무료로 사용할 수 있다. 본인은 시놀로지 Nas에 webDAV를 설정하고, Zotero와 연결해서 사용하고 있다. 시놀로지 Nas에서 외부 접속을 허용하고, WebDAV를 설정하는 방법은 [여기](https://sudormrf.run/2022/09/18/zotero-synology-webdav/) 블로그에서 잘 설명하고 있다. 다음 그림은 Zotero > Settings > Synk에서 WebDAV를 설정하는 방법이다. Verify Server를 하면 WebDAV가 잘 작동한다. 아이패드도 동일하게 동기화하고 싶다면, 동일하게 Settings에서 WebDAV를 설정해주면 된다.

![webdav setting](/zotero-setting/webdav.png)

### 목록에 Status, Rating, Remark 설정하기

목록에 위와 같은 메타데이터를 보이게 하려면 [zotero style](https://github.com/MuiseDestiny/zotero-style) 플러그인을 설정해야 한다. 깃헙에서 Zotero 7 버전을 위한 `.xpi` 파일을 다운로드 받고, Tools > Add-ons를 클릭하면 다음과 같은 창이 뜬다. 이 창에 xpi 파일을 드래그하면 자동적으로 설치된다. 파란색으로 버튼이 클릭되어 있으면 해당 플러그인이 작동되고 있는 것이다.

![plugin list](/zotero-setting/plugin.png)

Status, Rating, Remark가 목록에 보이게 하려면, 논문의 목록 메타데이터가 보이는 줄(예: Title, Creator)에서 오른쪽 버튼을 클릭한다. 떠오르는 창에서 Status, Rating, Remark를 체크표시 해주면 된다. 개별 컬럼에 대한 style을 변경하고 싶다면, zoterostyle-column-Setting을 클릭하면 된다(이게 뜨지 않는 컬럼도 있다).

- Status: 색 표시한 태그만 나타난다. 태그에 색을 칠하는 방법은 [여기](https://www.zotero.org/support/collections_and_tags)에서 볼 수 있다. 색 표시한 태그가 2가지 이상이면 처음 선정한 태그만 나타난다.
- Rating: 아래 그림의 오른쪽 Info에서 Rating을 클릭할 수도 있고, 목록에서 직접 클릭할 수도 있다. 초기 세팅은 지금과 같은 별 이모지가 아닐 수 있다. 별에 해당하는 이모지를 바꾸고 싶다면 해당 컬럼에서 오른쪽 버튼을 클릭한 후에 zoterostyle-column-Setting으로 이모지를 변경하면 된다.
- Remark: 아래 그림의 오른쪽 Info에서 Remark 옆의 칸을 클릭하면 작성할 수 있다. 짧은 글이나 이모지를 작성하는 것이 가능하다. 개인적으로 수업 때 주차별로 읽는 논문을 표시하고 있다.

![style](/zotero-setting/style.png)

### unread 기능 추가하기

처음 Zotero에 논문을 추가할 때 `/unread`라는 태그가 자동적으로 뜨고, 해당 논문을 열면 이 태그가 꺼지는 기능을 넣고싶었다. 이 기능은 [zotero action tag](https://github.com/windingwind/zotero-actions-tags) 플러그인으로 설정할 수 있다. 깃헙에서 위에 설치한 플러그인과 동일하게 xpi 파일을 드래그해주면 된다. Zotero > Settings > Actions & Tags를 클릭하면 다음과 같은 창을 볼 수 있다. 아래 목록은 기본적으로 unread 기능이 디폴트로 설정된 것이다. 첫번째 줄은 논문 추가시 자동으로 `/unread` 태그가 붙는 것이고, 두번째 줄은 논문을 열면 `/unread` 태그가 사라지는 것이다. 이렇게 개별 논문의 태그에 `/unread`를 추가하고, 해당 태그에 대해 color를 부여하면 Status에 나타나게 된다.

![action tags](/zotero-setting/action-tags.png)

### Translator 붙이기

영어 논문을 읽을 때 매우 유용한 플러그인이 바로 [zotero PDF translate](https://github.com/windingwind/zotero-pdf-translate#readme)이다. 깃헙에서 플러그인 설치한 것과 동일하게 설정해주면 된다. 단, Zotero 7의 버전에 맞는 플러그인을 설치해준다. Zotero > Settings > Translate를 클릭하면 다음 창이 나타난다. 다음과 같이 Translate from English to Korean으로 설정하면 영어를 한국어로 번역해준다.

![translate setting](/zotero-setting/translate-setting.png)

영어 논문 하나를 열어보자. 원하는 문장을 선택하면 자동으로 번역이 된 팝업이 뜬다. 팝업을 드래그해서 오른쪽 노트에 넣어주면, 오른쪽과 같이 원문과 번역이 같이된 글을 노트에 작성할 수 있다. 괄호 안에 있는 인용을 클릭하면, 해당 글이 있는 PDF 본문으로 페이지를 이동해준다.

![translate result](/zotero-setting/translate-result.png)

### 짜잘한 기능 추가하기

Zotero 자체에서 서지 정보에 attachment를 추가할 때 파일 이름을 자동으로 변경해준다. 이 파일 이름의 포맷팅을 변경할 수 있는데, 이 설정은 간이 stript 파일을 수정하는 방법이라고 보면 된다. Settings > Advanced에서 조그맣게 된 `config Editor` 버튼을 누르고, 검색으로 extensions.zotero.attachmentRenameTemplate을 찾는다. 다음과 같이 변경하면 파일 이름이 2017_Park_Knowledge graph와 같은 방식으로 설정된다. 변경된 포맷으로 attachment의 이름을 바꾸고 싶다면, 해당 파일의 오른쪽 버튼에서 Rename File from Parent Metadata를 눌러주면 된다.

```
{{ year suffix="_" }}{{ firstCreator suffix="_" }}{{ title truncate="100" }}
```

---

Zotero를 이렇게 커스터마이징한 후 논문을 더 자주 보고 있다🥰 이게 바로 이쁜 UI의 긍정적인 효과다! 기존의 Note 기능도 훌륭해서 논문을 읽을 때 적극적으로 활용하고 있다. 다들 Zotero로 정착하세요~🍎
