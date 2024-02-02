---
title: 논문 리뷰 | LLaMA를 파인튜닝한 Alpaca 모델 알아보기
description: Alpaca는 스탠포드 대학에서 개발한 오픈소스 경량 모델로, 학술 예산 내에서 어떻게 언어모델을 개발했는지 알아보자.
slug: llm-alpaca
author: 박하람
category: NLP/LLM
datetime: 2024. 01. 22.
language: Korean
featured: None
tags:
  - Llama
  - Alpaca
  - Fine-tuning
---

연구실에서 LLM 스터디를 진행하고 있다. 공부한 흔적을 블로그 포스팅으로 남겨보려고 한다. 오늘 포스팅은 스탠포드 대학에서 개발한 오픈소스 경량 모델 `Alpaca`를 리뷰한다. 기존의 LLM 연구는 자본 투자가 활발한 빅테크 기업 중심으로 진행되었는데, Meta가 `LLaMA`를 오픈소스로 공개하면서 저비용으로 LLM 개발이 가능해졌다. 학계에서 관련 연구를 진행한 대표적인 사례가 바로 `Alpaca`다. 포스팅 내용은 아래 참고자료를 광범위하게 참조하여 정리했다.

### 개요

`Alpaca`는 Meta의 `LLaMA 7B` 모델을 파인 튜닝한 `instruct-following` 언어모델이다. `self-insturct` 방식으로 생성된 5만 2천개의 데이터가 `Alpaca`의 학습에 사용됐다. `Alpaca`의 목적이 학술 예산 내에서 언어모델을 개발하는 것이기 때문에, 500$ 이하의 적은 비용으로 `Alpaca`를 개발했다는 것을 강조하고 있다. 특히, `Alpaca`는 학술 연구에만 사용할 수 있고, 상업적 사용은 제한된다.

### 고려사항

Alpaca의 개발자들은 학술 예산으로 고품질의 `instuction-following` 모델을 학습시킬 때 2가지의 어려운 점을 언급한다. (1) 사전학습된 강력한 언어모델과 (2) 고품질의 `instruction-following` 데이터가 존재해야 한다. 첫번째 어려운 점은 Meta에서 개발한 `LLaMA` 모델로, 두번째 어려운 점은 `self-instruct` 방식으로 자동적으로 instruction 데이터를 생성하는 것으로 해결되었다고 설명한다.

### `self-instruct`란?

`self-insturct`는 언어모델을 사용해 insturction 데이터를 생성하는 방법이다. 즉, `self-instruct`는 인간이 수동으로 instruction 데이터를 구축하지 않고도 자동적으로 insturction 데이터를 생성할 수 있는 방법을 제공한다.

`Alpaca`는 `self-instruct`의 방법을 사용하지만, 간략화된 `self-instruct` 방식을 사용한다. 처음 `self-instruct`를 제안한 논문은 다음의 그림과 같이 `self-instruct`의 방법을 설명하고 있다. 우선적으로 작업 풀에 인간이 작성한 175개의 시드(seed) 데이터가 업로드된다. 이 시드 데이터는 지시사항이 담겨있는 `Instruction`과 데이터 값이 포함된 `Input`, 결과가 담긴 `Output`으로 구성된다. 시드 데이터는 새로운 `instruction`과 `input`, `output` 인스턴스를 생성하기 위해 LLM의 프롬프트로 제공된다. LLM이 생성한 결과 중 품질이 좋지 않거나 비슷한 데이터는 필터링하고, 남은 데이터는 다시 작업 풀에 추가한다. 이런 과정을 여러 번 반복하면 대량의 instruction 데이터가 생성된다.

결과적으로 인간이 사용한 175개의 최소 시드 데이터를 사용하지만, 파인튜닝을 위한 학습 데이터의 생성에 대규모의 돈을 투자하기 어려운 학계에서 활용하기 좋은 방안이라 생각했다.

<figure>
    <img src="/llm-alpaca/2-3-self-instruction.jpeg" title="self instruction">    
    <figcaption style="text-align: center;">Self-instruction 과정 (Wang et al, 2022)</figcaption>
</figure>

### Alpaca의 학습 과정

`Alpaca`의 학습 과정은 다음과 같다. 기존의 연구와 같이 인간이 작성한 175개의 시드 데이터로 시작한다. 다음 단계는 `text-davinci-003`에 시드 데이터를 예제로 사용해 추가적인 instruction 데이터를 생성하도록 한다. 이 과정에서 OpenAI의 API를 사용한 비용은 500달러 미만으로, 약 70만원 정도로 총 5만 2천개의 instruction 데이터를 생성했다. 다음은 생성된 데이터를 기반으로 HuggingFace의 학습 프레임워크를 활용해 `LLaMA` 모델을 파인튜닝한다. 초기 실행의 경우 `LLaMA 7B` 모델을 파인튜닝하는 데 8개의 80GB A100에서 3시간이 소요됐고, 대부분의 클라우드 제공업체에서 100달러(약 15만원) 미만의 비용이 든다고 한다. (하지만 테스트 비용까지 생각하면 더 많이 들었을 것 같은데...!)

<figure>
    <img src="/llm-alpaca/2-3-fine-tuned-alpaca.png" title="fine-tuned-alpaca">    
    <figcaption style="text-align: center;">Alpaca 모델의 구축과정 (Taori et al, 2023)</figcaption>
</figure>

### 평가와 한계

작은 모델 크기와 제한된 데이터 학습을 고려하면, `Alpaca`는 `text-davince-003`과 유사한 성능을 가진다고 평가한다. 다음은 `Alpaca`가 답변한 결과의 예시다. `Alpaca`의 답변이 일반적으로 ChatGPT보다 짧은 이유는 `text-davince-003` 모델로 생성한 instruction 데이터가 짧기 때문이다.

<figure>
    <img src="/llm-alpaca/2-3-alpaca-result.png" title="alpaca-result">    
    <figcaption style="text-align: center;">Alpaca의 응답 (Taori et al, 2023)</figcaption>
</figure>

`Alpaca`는 다른 언어모델과 같이 환각(hallucination)과 독성(toxicity), 고정관념 등이 나타난다. 그럼에도 불구하고, 해당 결함을 연구할 수 있는 가벼운 모델을 제공하는 것이 커뮤니티에 더 유용할 것이라 생각하기 때문에 `Alpaca`를 공개한다고 설명한다. 그러나 현재 Alpaca 데모는 호스팅 비용과 컨텐츠 필터가 잘 작동하지 않는 것을 고려하여 중단됐다.

---

간단하게 `Alpaca` 모델에 대해 알아봤다. 아쉬운 점은 논문이 아니라 그런지 `Alpaca`의 성능에 대한 객관적인 평가가 없다. 학교에서 할 수 있는 최대로 해본 것 같지만, 그럼에도 상용 LLM이 훨씬 성능이 좋은 건 어쩔 수 없는 것인가라는 생각이🥲 그래도 `LLaMA` 덕분에 더 활발히 LLM 연구가 이루어질 수 있게 됐으니...!

### 참고자료

- Taori et al., (2023). Alpaca: A Strong, Replicable Instruction-Following Model, Stanford CRFM. [[바로가기]](https://crfm.stanford.edu/2023/03/13/alpaca.html)
- Wang, Y., Kordi, Y., Mishra, S., Liu, A., Smith, N. A., Khashabi, D., & Hajishirzi, H. (2022). Self-Instruct: Aligning Language Models with Self-Generated Instructions. arXiv. https://doi.org/10.48550/arxiv.2212.10560
- [리뷰] Meta LLaMA의 친척 - Stanford Univ의 Alpaca, daewoo kim. [[바로가기]](https://moon-walker.medium.com/%EB%A6%AC%EB%B7%B0-meta-llama%EC%9D%98-%EC%B9%9C%EC%B2%99-stanford-univ%EC%9D%98-alpaca-ec82d432dc25)
