---
title: 파이썬으로 한글(hwpx)의 표 읽고 csv로 저장하기 (feat. beautifulsoup)
description: 파이썬의 beautifulsoup으로 한글 hwpx에 있는 표를 읽어들여 csv로 생성하는 방법을 소개한다.
slug: python-read-hwpx
author: 박하람
category: Python
datetime: 2024. 08. 22.
language: Korean
featured: None
tags:
  - qlever
  - knowledge graph
  - index
  - sparql engine
---

한글에 있는 103개의 표를 csv 형태로 저장해야 하는 일이 생겼다. 이전에 한글을 파이썬으로 처리할 수 있는 pyhwpx 등의 모듈이 있다는 소식을 듣고, 테스트해보려고 했지만 설치가 잘 안됐다. 그러나, 한글은 hwpx를 제공해 xml 형태의 데이터를 제공하기 때문에, 별도의 한글전용 모듈을 사용하지 않고 데이터를 읽어올 수 있다. 오늘 포스팅은 웹 크롤링에 많이 사용되는 beautifulsoup을 사용해 한글에서 표의 데이터를 가져와 csv 형태로 만드는 방법에 대해 소개한다.

### hwpx로 처리하기

한글의 기본 형식인 hwp는 기본적으로 기계로 처리하기 어렵다. 여러가지 돌아가는 방법은 있지만, 그 자체로 처리하긴 상당히 어렵다. 이런 맥락에서 hwpx는 hwp의 형식의 문서가 기계가 비교적 쉽게 처리할 수 있도록 개발한 형식이다[^1]. 한글 문서가 hwp로 작성되어 있다면, 다른 이름으로 저장하기에서 hwpx로 저장하면 된다. 다음의 과정을 따르면, hwpx에서 파이썬으로 처리가능한 xml 형식으로 데이터에 접근할 수 있다.

1. hwpx로 된 확장자를 zip으로 변경한다.
2. zip으로 된 압축파일을 해제한다.
3. 압축 해제시 다음과 같은 경로와 파일이 생성되고, `section0.xml`에 문서 안의 정보가 담겨있다.

한글 문서가 상당히 쪽수가 많을 경우에 `section0.xml`, `section1.xml`, `section2.xml` 등과 같이 여러 개의 xml 파일이 생성될 수 있다. 개인적으로 필요한 부분만 한글을 남겨 `section0.xml`로 남기는게... 덜 고생하는 방법이라 생각한다.

```
document
├─ mimetype
├─ settings.xml
├─ version.xml
├─ Preview
├─ META-INF
└─ Contents
   ├─ content.hpf
   ├─ header.xml
   └─ section0.xml
```

### 한글 표의 xml 구조 파악하기

아래와 같은 형식으로 103개의 표가 있다.

![hwpx table](/python-read-hwpx/hwpx_table.png)

`section0.xml` 파일에서 다음 형식의 표는 아래와 같이 xml 형식으로 표현된다. 위 표의 한줄에 해당하는 구조가 다음과 같다. 상당히 복잡하지만, 개별 표는 `hp:tbl`로, 개별 행은 `hp:tr`로 감싸져있다. 개별 행의 컬럼마다 `hp:tc`로 감싸져있다.

```xml
<hp:tbl id="1617592774" zOrder="1" numberingType="TABLE" textWrap="TOP_AND_BOTTOM" textFlow="BOTH_SIDES" lock="0" dropcapstyle="None" pageBreak="CELL" repeatHeader="1" rowCnt="4" colCnt="2" cellSpacing="0" borderFillIDRef="5" noAdjust="0">
  ...
  <hp:tr>
    <hp:tc name="" header="0" hasMargin="0" protect="0" editable="0" dirty="0" borderFillIDRef="5">
      <hp:subList id="" textDirection="HORIZONTAL" lineWrap="BREAK" vertAlign="CENTER" linkListIDRef="0" linkListNextIDRef="0" textWidth="0" textHeight="0" hasTextRef="0" hasNumRef="0">
        <hp:p id="2147483648" paraPrIDRef="21" styleIDRef="23" pageBreak="0" columnBreak="0" merged="0">
          <hp:run charPrIDRef="8">
            <hp:t>제목</hp:t>
          </hp:run>
          <hp:linesegarray>
            <hp:lineseg textpos="0" vertpos="0" vertsize="1100" textheight="1100" baseline="935" spacing="660" horzpos="0" horzsize="9488" flags="393216"/>
          </hp:linesegarray>
          </hp:p>
      </hp:subList>
      <hp:cellAddr colAddr="0" rowAddr="0"/><hp:cellSpan colSpan="1" rowSpan="1"/><hp:cellSz width="10509" height="282"/>
      <hp:cellMargin left="510" right="510" top="141" bottom="141"/>
    </hp:tc>

    <hp:tc name="" header="0" hasMargin="0" protect="0" editable="0" dirty="0" borderFillIDRef="5">
      <hp:subList id="" textDirection="HORIZONTAL" lineWrap="BREAK" vertAlign="CENTER" linkListIDRef="0" linkListNextIDRef="0" textWidth="0" textHeight="0" hasTextRef="0" hasNumRef="0">
        <hp:p id="2147483648" paraPrIDRef="20" styleIDRef="22" pageBreak="0" columnBreak="0" merged="0">
          <hp:run charPrIDRef="8">
            <hp:t>AbcdEfgd</hp:t>
          </hp:run>
          <hp:linesegarray>
            <hp:lineseg textpos="0" vertpos="0" vertsize="1100" textheight="1100" baseline="935" spacing="660" horzpos="0" horzsize="33260" flags="393216"/>
          </hp:linesegarray>
        </hp:p>
      </hp:subList>
      <hp:cellAddr colAddr="1" rowAddr="0"/><hp:cellSpan colSpan="1" rowSpan="1"/>
      <hp:cellSz width="34281" height="282"/><hp:cellMargin left="510" right="510" top="141" bottom="141"/>
    </hp:tc>
  </hp:tr>
  ...
</hp:tbl>
```

### beautifulsoup으로 표 읽어오기

위의 구조를 파악했다면 다음과 같이 csv로 변환하는 코드를 짤 수 있다. `section0.xml` 파일을 불러와 beautifulsoup으로 파싱한 다음, `hp:tbl` 태그를 모두 가져온다(`soup.find_all`). 다음은 개별 테이블마다 개별 행을 찾고(`table.find_all("hp:tr")`), 또 거기에서 개별 컬럼별로 실제 값을 가져온다(`cell.get_text(strip=True)`). 이렇게 가져온 데이터를 데이터프레임으로 변환하고, csv로 저장한다.

```py
def hwpx_to_csv():
    xml_file_path = "document/Contents/section0.xml"
    with open(xml_file_path, "r", encoding="utf-8") as file:
        xml_data = file.read()

    soup = BeautifulSoup(xml_data, "lxml-xml")

    # 모든 표 가져오기
    tables = soup.find_all("hp:tbl")

    # 표의 개별 행마다 데이터 추출하기
    table_data = []

    for table in tables:
        rows = table.find_all("hp:tr")
        for row in rows:
            row_data = []
            cells = row.find_all("hp:tc")
            for cell in cells:
                text = cell.get_text(strip=True)
                row_data.append(text)
            table_data.append(row_data)

    # DataFrame으로 변환
    df = pd.DataFrame(table_data)
    df.to_csv("output.csv", index=False)
```

결과는 다음과 같이 csv로 저장된다. 휴...🥲 103개의 모든 한글 테이블을 노가다로 불러오지 않을 수 있어서 다행이었다. (하지만, xml 구조를 파악하는 데 시간이 걸려서 이것도 코딩 노가다 아닌가하는 생각이...)

|      |                                                      |
| ---- | ---------------------------------------------------- |
| 제목 | AbcdEfgd                                             |
| URL  | AbcdEfgd                                             |
| 일자 | 2024-05-24                                           |
| 설명 | 한글문서를 파이썬으로 읽어오는 방법에 대해 설명한다. |

[^1]: 자세한 설명은 [여기](https://www.ajunews.com/view/20210427190629821) 기사를 참고하면 된다.
