---
title: Vue3에서 v-network-graph로 그래프 데이터 시각화하기
description: 지식그래프와 같이 그래프 형태의 데이터는 시각화하여 데이터 사이의 연결을 보여주는 것이 직관적이다. Vue 3에서 v-network-graph를 활용해 네트워크 시각화를 그려보자.
slug: vue-v-network-graph
author: 박하람
category: Web Development
datetime: 2023. 12. 14.
language: Korean
featured: None
tags:
  - vue3
  - v-network-graph
---

Vue 환경에서 그래프 데이터를 시각화할 수 있는 모듈을 찾다가 `v-network-graph`를 발견했다. 코드도 단순하고, `v-network-graph`에 맞게 데이터를 만드는 것이 쉬워 입문으로 적절한 모듈이라 생각했다. [공식 문서](https://dash14.github.io/v-network-graph/getting-started.html)에 설명이 잘 되어 있지만, 한국어로 된 글이 잘 없어서 포스팅을 작성해본다. 최종 목표는 `v-network-graph`를 활용해 다음과 같은 시각화 결과를 얻는 것이다. API에서 데이터를 가져와 동적으로 그래프 데이터를 생성하고, 상단 오른쪽과 같이 4개의 버튼 기능을 추가한다.

![visualization](/vue-v-network-graph/visualization.png)

### Vue3 프로젝트에서 설치와 설정

다음과 같이 해당 모듈을 설치해주고, `main.js`에서 다음과 같이 설정해준다. 공식 문서는 `main.ts`에서 작성하는 코드를 설명하는데, 타입스크립트를 사용하지 않아 `main.js`에 작성했다.

```bash
npm install v-network-graph # 설치
```

```js
# main.js
import { createApp } from "vue"
import App from './App.vue'
import VNetworkGraph from "v-network-graph"
import "v-network-graph/lib/style.css"

const app = createApp(App)

app.use(VNetworkGraph)
app.mount('#app')
```

### 데이터 생성하기

우선적으로 그래프 데이터를 시각화하기 위해 개별 노드와 엣지를 설졍해주어야 한다. 기본 데이터 구조는 다음의 코드와 같다.

`nodes`와 `edges`는 `JSON` 형태의 데이터다. 개별 노드는 `id`, `type`, `size`, `color`, `collapse`, `children` 등의 속성을 갖는다. `type`는 둥근 모양이나 사각형을 지정할 수 있다. `collapse`는 해당 노드와 연결된 노드를 한 번에 보여줄 지에 대한 속성이다. `collapse`가 `false`라면, 해당 노드와 연결된 노드는 클릭해야 연결된 노드가 나온다. `children`은 해당 노드와 연결된 노드를 트리 형태로 만들 수 있다. `uri`는 내가 추가한 속성으로 노드의 URI 값을 부여한다.

개별 엣지는 `source`와 `target`, `label` 등의 속성이 있다. 시각화할 그래프가 directed graph라면 `source`가 시작하는 노드, `target`이 끝나는 노드이다. 지식그래프와 같이 labelled된 edge를 갖고 있다면 `label`에 대한 설정이 가능하다.

```vue
<script setup>
const nodes = {
  node1: {
    id: 'node1',
    name: 'Node 1',
    type: 'circle',
    size: 15,
    color: '#FFEE93',
    collapse: false,
    children: {},
    uri: 'http://test.domain.com/id/12345677',
  },
  node2: {
    id: 'node2',
    name: 'Node 2',
    type: 'circle',
    size: 15,
    color: '#FFEE93',
  },
  node3: {
    id: 'node3',
    name: 'Node 3',
    type: 'circle',
    size: 15,
    color: '#FFEE93',
  },
}

const edges = {
  edge1: { source: 'node1', target: 'node2', label: 'label 1' },
  edge2: { source: 'node2', target: 'node3', label: 'label 2' },
}
</script>
```

나는 입력값에 따라 API에서 데이터를 불러와 동적으로 노드와 엣지를 만들어줘야 했다. 백엔드에서 노드와 엣지를 만드는 API를 생성하고, 프론트에서 해당 API의 출력값을 가져오는 방식으로 데이터를 생성했다.

### HTML과 CSS 설정하기

그림과 같은 화면을 만들기 위해 다음과 같이 `<template></template>`를 작성한다. CSS는 Tailwind CSS를 사용하여 HTML을 디자인했다. `v-network-graph`가 기본적으로 노드와 엣지가 시각화되는 공간이다. `v-network-graph`는 script에서 정의된 `nodes`와 `edges`, `layouts`, `configs`, `eventHandlers`를 사용한다. `<template #edge-label>`은 엣지의 레이블을 정의하는 템플릿이다.

`v-network-graph`는 줌인 또는 줌아웃을 할 수 있는 기능을 제공한다 [^1]. `v-network-graph`에 `ref="graph"`를 지정하고 스크립트에서 `graph`를 정의해준다. `config`에서 줌의 최소와 최대 단계를 설정해준다.

```vue
<template>
  <div class="w-full mb-4 border rounded-lg shadow-sm my-4">
    <div class="flex flex-row-reverse mt-2">
      <button @click="graph && graph.zoomOut()">Zoom Out</button>
      <button @click="graph && graph.zoomIn()">Zoom In</button>
      <button @click="graph && graph.fitToContents()">Fit</button>
      <button @click="graph && graph.panToCenter()">To center</button>
    </div>
    <v-network-graph
      ref="graph"
      class="w-full static"
      :nodes="nodes"
      :edges="edges"
      v-model:layouts="layouts"
      :configs="configs"
      :event-handlers="eventHandlers"
      style="height:650px;"
    >
      <template #edge-label="{ edge, ...slotProps }">
        <v-edge-label
          :text="edge.label"
          vertical-align="above"
          v-bind="slotProps"
        />
      </template>
    </v-network-graph>
  </div>
</template>

<script>
export default {
  setup() {
    const zoomLevel = ref(1)
    const graph = ref()

    const configs = reactive(
      vNG.defineConfigs({
        view: {
          minZoomLevel: 0.1,
          maxZoomLevel: 16,
        },
      })
    )

    return { zoomLevel, graph, configs }
  },
}
</script>
```

### nodes와 edges 설정하기

노드와 엣지는 동적으로 데이터를 가져온다. 노드는 `nodes`로, 엣지는 `edges`로 정의한다. 초기에 뿌려지는 6개의 노드는 위치를 지정하고 싶어서 `layouts`을 정의했다.
동적으로 생성되는 노드의 위치는 동적으로 생성되도록 하고 싶어 따로 `layouts`를 설정하지 않았다.

```vue
<script>
const nodes = reactive({ ... })

const edges = reactive({ ... })

const layouts = reactive({
  nodes: {
    node1: { x: 0, y: 0, fixed: true },
    node2: { x: -90, y: 0 },
    node3: { x: -180, y: 0 },
    node4: { x: 90, y: 180 },
    node5: { x: 270, y: -180 },
    node6: { x: 180, y: 0 },
  },
})
</script>
```

### 자동적으로 노드 위치 설정하기

기본적으로 노드의 위치는 `layouts`에서 개별 노드마다 지정한다. 동적으로 가져오는 데이터가 존재하고, 그래프 데이터가 동적으로 움직이는 모습을 보여주고 싶어서 `d3-force`를 사용했다.
`v-network-graph`는 `d3-force`를 사용해 노드의 위치를 자동화하고 이동할 수 있는 방법을 제공한다[^2]. `d3-force`는 개별 모듈이라 따로 설치하고, 모듈을 import한다. 설정은 `configs`에서 한다. `configs`의 `view`에서 `layoutHandler`를 설정하고 시뮬레이션이 발생하도록 지정한다.

```bash
npm install d3-force
```

```vue
<script>
import { ForceLayout } from "v-network-graph/lib/force-layout"

export default {
    ...,
    setup() {
         const configs = reactive(vNG.defineConfigs({
            view: {
                layoutHandler: new ForceLayout({
                    positionFixedByDrag: true,
                    positionFixedByClickWithAltKey: true,
                    createSimulation: (d3, nodes, edges) => {
                        const forceLink = d3.forceLink(edges).id(d => d.id)
                        return d3
                        .forceSimulation(nodes)
                        .force("edge", forceLink.distance(55).strength(1))
                        .force("charge", d3.forceManyBody().strength(-2500))
                        .alphaMin(0.001)
                    }}
                ),
                minZoomLevel: 0.1,
                maxZoomLevel: 16,
            },
         }))

        return { eventHandlers }
    }
}
</script>
```

### 노드 클릭시 이벤트 설정하기

노드를 클릭했을 때 이번트를 지정하고 싶어서 eventHandlers를 정의했다. 왼쪽 클릭은 `node:click`에서 정의했고, 오른쪽 클릭은 `node:contextmenu`에서 정의했다. 왼쪽 버튼으로 노드를 클릭하면, 해당 노드의 children으로 묶였던 노드가 펼쳐진다. 오른쪽 버튼으로 노드를 클릭하면, 해당 노드의 `uri`에 정의된 링크로 새로운 윈도우가 열린다.

```vue
<script>
const eventHandlers = {
  'node:click': ({ node }) => {
    const children = nodes.value[node]?.children
    const parentPos = layouts.nodes[node]
    if (children && parentPos) {
      nodes.value[node].collapse = !nodes.value[node].collapse
      Object.values(children).forEach((n) => {
        layouts.nodes[n.id] = {
          x: parentPos.x,
          y: parentPos.y,
        }
      })
    }
  },
  'node:contextmenu': ({ node }) => {
    if (nodes.value[node].uri != 'null') {
      window.open(nodes.value[node].uri, '_blank')
    }
  },
}
</script>
```

`v-network-graph`는 Vue 환경에서 그래프 데이터를 시각화하기에 편리한 모듈이다. 기본적인 사용법은 간단하지만, 이것저것 기능을 추가하려면 생각보다 시간이 든다.
특히, 노드와 엣지 데이터를 만드는 데 많은 시간을 소요했다..🥲 그래도 파이썬에서 시각화 할 때보다 훨씬 이쁜 거 같아서 만족한다.

[^1]: https://dash14.github.io/v-network-graph/examples/basic.html#pan-and-zoom
[^2]: https://dash14.github.io/v-network-graph/examples/layout.html#position-nodes-with-d3-force
