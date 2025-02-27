---
title: 행정동코드, 법정동코드, 행정구역코드 뽀개기
description: 대한민국의 행정구역코드는 행안부의 행정동코드, 법정동코드와 통계청의 행정구역코드가 있다. 복잡한 코드 관계를 한번에 정리한다!
slug: korea-admin-codes
author: 박하람
category: Data
datetime: 2021. 12. 28. 20:00
language: Korean
featured: None
tags:
  - 행정동코드
  - 법정동코드
  - 행정구역코드
  - 행정안전부
  - 통계청
---

<div class="note">

📍 유의사항 <br>
2021년 12월 28일 기준으로 통계청의 한국행정구역분류 체계가 기존의 7자리에서 8자리로 변경되었습니다. 현재 게시글은 7자리 코드 체계를 기준으로 설명하고 있으니 참고해주세요.

</div>

행정구역의 데이터를 모델링할 때 골머리를 앓았던 부분이 바로 코드 체계다. 대한민국의 행정구역코드는 행정안전부의 `행정동코드`와 `법정동코드`, 통계청의 `행정구역코드`가 있다. 같은 행정구역이라도 어떤 기관에서 사용하는지에 따라 다른 이름과 코드체계를 가질 수 있다. 행정구역 코드 체계를 한번에 정리해보자!

### 행정동과 법정동

- 행정동 : 행정상으로 관할하는 행정기관(읍면동) 명칭
- 법정동 : 공부상의 법정주소로서 문서에 표기되거나 주소에 사용

우리나라의 동은 행정동과 법정동으로 나뉜다. 쉽게 생각하면, <u class="line">행정동은 동사무소가 설치되는 구역, 법정동은 주소에 사용되는 구역이다.</u> 행정동마다 동사무소를 설치하기 때문에 행정안전부는 행정동을 행정기관으로 보고, 행정동코드를 행정기관코드로 쓴다. 행정동과 법정동은 `N:M`의 관계로, 하나의 행정동에 여러 개의 법정동으로 구성될 수 있고 그 반대도 가능하다. 행정동인 노량진제1동은 법정동인 본동과 노량진동으로 구성된다. 법정동인 노량진동은 행정동인 노량진제1동과 노량진제2동으로 구성된다.

### 행정동코드와 법정동코드

- 법정동코드 : `12(시도) + 345(시군구) + 678(읍면동) + 90(리)`
- 행정동코드 : `12(시도) + 345(시군구) + 678(읍면동) + 00`

행정동코드와 법정동코드는 모두 10자리로, 각각 행정동과 법정동을 표현한다. 동 단위로 코드가 구분되므로, <u class="line">시도와 시군구, 읍면까지의 행정동코드와 법정동코드는 같다. 동리 단위에서 행정동코드와 법정동코드가 달라진다.</u> 법정동코드는 리까지 표현되는 반면, 행정동코드는 리를 표현하지 않는다. 법정동코드는 앞의 2자리까지 시도, 다음 3자리는 시군구, 다음 3자리는 읍면동, 나머지 2자리는 리를 표현한다. 예를 들어, 서울특별시 동작구 흑석동은 서울특별시 `11`, 동작구 `590`, 흑석동 `105`로 구성된다. 행정동코드는 앞의 8자리까지 구성이 같고, 리는 표현하지 않으므로 나머지 2자리는 `00`으로 끝난다.

<img src="/korea-admin-codes/korea-admin-code-ex.png" class="img"/>

행정동코드와 법정동코드의 규칙을 알면, 시도와 시군구, 읍면동의 행정동코드 또는 법정동코드를 얻을 수 있다. 예를 들어 흑석동의 시도코드는 앞의 2자리이므로, `1100000000`(서울특별시)이다. 동작구는 앞의 5자리 `1159000000`(서울특별시 동작구)이다. 이하의 단위는 모두 0으로 채운다. 이처럼 법정동코드와 행정동코드로 시도, 시군구 단위의 코드를 얻을 수 있다.

### 한국행정구역분류코드(통계청)

- 행정구역코드 : `12(시도) + 345(시군구) + 78(읍면동)`

통계청은 통계작성을 목적으로 한국행정구역분류코드를 제공한다. 행정구역코드는 읍면동 단위까지만 표현하고, 동은 행정동 기준이다. <u class="line">통계청의 행정구역코드는 행정안전부의 행정동코드와 `1:1` 대응된다.</u> 시도(대분류) 2자리, 시군구(중분류) 3자리, 읍면동(소분류) 2자리 코드 체계를 가진다(2021년 10월 기준)[^1]. 행정동코드와 법정동코드는 항상 10자리로 일정하지만, 행정구역코드는 시도, 시군구와 읍면동 단위에 따라 코드 자리수가 다르다. 예를 들어, 서울시는 `11`, 서울시 동작구는 `11200`, 서울시 동작구 흑석동은 `1120071`이다. 통계청에서 제공하는 분류 코드가 필요한 이유는 통계청의 행정구역코드를 기준으로 행정구역 경계 폴리곤 데이터(행정동 기준)를 제공하기 때문이다.

### 행정동코드, 법정동코드와 행정구역코드

![stat koad code](/korea-admin-codes/stat-koad-code.png)

통계청은 행정동과 법정동의 연계 코드를 제공한다. [아래](#행정구역코드-다운로드)의 통계청 데이터를 다운받으면, 위의 그림과 같이 `행정동 및 법정동와의 연계표`를 볼 수 있다. 행정구역명과 행정동(행정기관명)이 조금 다른데, 각 기관에서 사용하는 명칭이 조금씩 다를 뿐 실제 지칭하는 대상은 같다[^2].

### 행정구역코드 다운로드

|  제공기관  |                                                링크                                                | 업데이트 주기 | 설명                                                                                                                                                                                                   |
| :--------: | :------------------------------------------------------------------------------------------------: | :-----------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 행정안전부 | [LINK](https://www.mois.go.kr/frt/bbs/type001/commonSelectBoardList.do?bbsId=BBSMSTR_000000000052) |     수시      | - 행정동코드와 법정동코드 매핑 데이터 제공 <br> - 주민등록업무 행정기관 및 관할구역 변경내역의 `jscode********.zip` 또는 `jscode********(말소코드포함).zip` 다운로드                                   |
|   통계청   |                   [LINK](https://kssc.kostat.go.kr:8443/ksscNew_web/index.jsp#)                    |     4분기     | - 통계청의 행정구역코드, 행정안전부의 행정동코드(행정기관코드와)<br> 법정동코드 매핑 데이터 제공 <br> - 사회분류 > 기타분류 - 한국행정구역분류 > 자료실 > `한국행정구역분류(****.**.** 기준)` 다운로드 |

[^1]: 2021년 12월 28일 기준으로 시도 2자리, 시군구 3자리, 읍면동 3자리 코드 체계를 가진다. 2022년 1월 1일에 새로운 코드가 공개되므로 추후 수정할 예정이다.
[^2]: 예를 들어 행정동은 '노량진제1동'으로 표현하고, 행정구역명은 '노량진1동'으로 표현한다.
