---
title: Vue3로 팝업창 만들기
description: Vue3에서 간단한 팝업창을 만들어 보자. 컴포넌트로 모달창을 만든 후, 클릭 이벤트로 모달창이 없어지게 하면 된다.
slug: modal-window-vue
author: 박하람
category: Web Development
datetime: 2023. 1. 13.
language: Korean
featured: Featured
tags:
  - Vue3
  - modal
  - Popup window
  - click event
---

Vue3 버전으로 웹 서비스를 베타로 운영하고 있다. 사용자가 홈페이지에 처음 들어올 때, 베타 버전이라고 안내하고 싶어서 팝업창을 하나 만들었다. 바닐라 JS로 모달창을 만드려면 꽤나 코드량이 많았을 것 같은데, vue로 만드니 훨씬 간단하다!

### 단계별 방법

단계별 방법은 간단하다. 기본적으로 팝업창은 이미 만들어졌다고 가정한다.

- 1단계: 컴포넌트로 미리 팝업창과 관련된 html, css 구조 짜놓기
- 2단계: 팝업창이 뜰 페이지에 컴포넌트를 집어넣기
- 3단계: 팝업창이 없어지는 이벤트 구현하기

### 1단계: 팝업창 컴포넌트 만들기

팝업창은 tailwind css를 사용하여 만들었다. 닫기(X)의 디자인과 호버 효과는 `Flowbite`의 일부를 가져왔다. 본인이 원하는 디자인으로 팝업창을 만들면 된다.

![modal design](/modal-window-vue/modal-design.png)

### 2단계: 팝업창이 뜰 페이지에 컴포넌트 추가하기

이 팝업창은 처음 웹 서비스에 접속하는 홈페이지에 띄울 것이다. `views` 폴더 내부에 있는 `index.vue`에 컴포넌트를 등록한 후, 인덱스 페이지의 가장 상단에 해당 컴포넌트를 추가한다. 완성된 팝업창은 다음 그림과 같다.

```{vue}
<template>
  <div class="w-full bg-white">

    <!-- popup window -->
    <PopUpView v-if="this.openModal == true" />
    ...
  </div>
</template>

<script>
import PopUpView from '@/components/PopUpView.vue' // 컴포넌트 불러오기
export default {
  name: 'IndexView',
  components: {
    PopUpView, // 여기에 추가해주기
  },
  ...
}
</script>

```

### 3단계: 이벤트 구현하기

사용자가 팝업창의 닫기(X)를 클릭하면, 팝업창이 닫히는 것을 구현해보자. `v-if`로 조건을 걸어주고, `@click` 이벤트로 조건을 바꿔주면 된다. `v-if`의 조건은 `openModal`이란 변수가 참일 때만 나타나도록 설정하고, 인덱스의 `data`에 `openModal`을 정의해준다. 인덱스 페이지가 처음 로딩될 때 나타나도록 디폴트 값을 `true`로 설정했다.

```{vue}
<script>
import PopUpView from '@/components/PopUpView.vue'
export default {
  name: 'IndexView',
  components: {
    PopUpView,
  },
  ...
  data() {
    return {
      openModal: true,
    }
  },
</script>
```

다음은 클릭 이벤트를 설정해준다. 여기서 중요한 것은 자식 컴포넌트에서 부모로의 데이터 전송이다. Index 페이지는 부모이고, 이 페이지에 포함된 자식 컴포넌트가 팝업창이다. 자식 컴포넌트에 있는 X 표시를 눌렀을 때, 이 이벤트가 부모인 Index 페이지에 전달되어 `this.openModal`이 `false`로 변경되어야 한다.

먼저 팝업창 컴포넌트에서 X 표시인 버튼에 `@click` 이벤트를 추가한다. `closeModal` 이벤트는 `methods`에 추가한다. `@click="closeModal`은 `sendClose`라는 이름으로 부모 페이지에 `false`라는 신호를 보낸다.

```{vue}
<template>
  ...
  <button type="button" @click="closeModal" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
    </svg>
  </button>
  ...
</template>

<script>
export default ({
    name: "PopUpView",
    methods: {
      closeModal() {
          this.$emit("sendClose", false)
      },
    }
})
</script>
```

다시 인덱스 페이지로 돌아와서, `@sendClose="closeModalView"`를 `v-if` 옆에 추가해준다. 여기서 @ 다음의 변수는 자식 컴포넌트에서 `this.$emit("sendClose", false)`의 `sendClose`와 동일해야 한다. `closeModalView`는 `methods`에 추가하고, 데이터를 전송받았을 때 구현될 이벤트를 정의한다. `sendClose`는 `false`라는 데이터를 전달했으므로, `closeModalView(data)`에서 `data`는 `false`로 정의된다. 여기서 `this.openModal`를 `data` 값으로 업데이트 해주면 이벤트 구현이 완성된다.

```{vue}
<template>
  <div class="w-full bg-white">

    <!-- popup window -->
    <PopUpView v-if="this.openModal == true" @sendClose="closeModalView" />
    ...
  </div>
</template>

<script>
import PopUpView from '@/components/PopUpView.vue' // 컴포넌트 불러오기
export default {
  name: 'IndexView',
  components: {
    PopUpView, // 여기에 추가해주기
  },
  ...
  methods: {
    closeModalView(data) {
      this.openModal = data
    },
  }
}
</script>

```

### 마지막으로

Vue를 사용하면, 컴포넌트 사이의 통신을 고려해야 하지만 한번 원리를 알면 통신은 어렵지 않다. 부모와 자식, 자식과 부모, 자식과 자식 컴포넌트의 통신만 할 수 있으면 웬만한 개발은 어렵지 않은 것 같다. 또한 자바스크립트에서 클릭 이벤트를 쉽게 구현할 수 있기 때문에 프론트 단을 빠르게 개발할 수 있다. 하지만.. 프론트는 하면 할 수록 어려운 것 같다 🥲
