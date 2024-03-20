---
title: streamlit으로 빠르게 이미지 갤러리 만들기
description: streamlit의 공식 문서는 이미지 갤러리를 만드는 코드가 없다! streamlit의 커뮤니티에서 발견한 이미지 갤러리를 만드는 방법을 공유한다.
slug: python-streamlit-img-gallery
author: 박하람
category: Python
datetime: 2024. 03. 20.
language: Korean
featured: None
tags:
  - streamlit
  - image gallery
  - python
---

정말 초스피드로 `html` 기반의 웹 어플리케이션을 만들어야 했던 적이 있었다. 아주 부족한 시간에 빠르게 만들 수 있는 웹 어플리케이션은 `streamlit`을 사용하면 된다고 판단했다. 구현사항 중 핵심은 이미지 carousel 또는 gallery를 만드는 것이었는데, carousel은 여러가지 모듈이 있었지만 적용이 잘 안됐다. 대안으로 선택한 이미지 갤러리는 로딩이 조금 느릴 순 있지만, 이미지 리스트를 간단한 갤러리와 같은 형식으로 보여줄 수 있다.

### streamlit으로 이미지 갤러리 생성하기

목표는 '개체 인식하기'란 버튼을 눌렀을 때, `data/component/` 경로에 있는 이미지 리스트가 화면에 갤러리 형태로 보이게 하는 것이었다. `recog_button_clicked`란 버튼이 클릭되면, 1초간 spinner가 실행된 다음 4컬럼의 컨테이너로 이미지가 보여지게 만들었다.

- `result_container`는 이미지를 담을 컨테이너를 정의한 변수다.
- `recognition_result_container`는 컨테이너의 컬럼을 4개로 정의한다.
- `data/component/` 경로에 있는 이미지 파일을 하나씩 가져와서 4개의 컬럼으로 구성된 컨테이너에 배치한다. `use_column_width=True`는 이미지 너비를 자동으로 조정하는 파라미터다.
- `data/component/` 폴더는 보여주고 싶은 이미지 파일(.png or .jpg)만 담아놓았다. 만약 특정 확장자를 지정하고 싶다면, `data/component/{file_name}.jpg`와 같은 형식으로 지정해주면 된다.

```py
# 개체 인식 버튼
recog_button_clicked = st.button("개체 인식하기", key="recog")

if recog_button_clicked:
    with st.spinner("분석을 진행하고 있습니다..."):
        time.sleep(1)

    result_container = st.container()

    recognition_result_container = result_container.columns(4)
    for i, comp_img in enumerate(comp_imgs):
        recognition_result_container[i % 4].image(
            f"data/component/{comp_img}", use_column_width=True
        )
```

위의 코드를 담아 streamlit을 실행하면, 다음과 같은 이미지 갤러리를 생성한다. View fullscreen으로 뜬 화살표 버튼을 클릭하면, 해당 사진을 확대해서 볼 수 있다. 초스피드로 이미지 갤러리 만들기 끝!

![streamlit-gallery](/python-streamlit-img-gallery/streamlit-img-gallery.png)
