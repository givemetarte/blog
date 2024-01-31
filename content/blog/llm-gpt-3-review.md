---
title: 논문 리뷰 | GPT-3 (Language Models are Few-Shot Learners)
description: Few-Shot Learning의 포문을 열었던 GPT-3의 논문 Langauge Models are Few-Shot Learners를 읽고 리뷰해보자.
slug: llm-gpt-3-review
author: 박하람
category: LLM
datetime: 2024. 01. 31.
language: Korean
featured: None
tags:
  - GPT-3
  - Few-shot
---

2020년에 발표된 GPT-3는 큰 파장을 가져왔다. 무려 1,750억개의 파라미터를 가진 거대한 스케일의 언어모델이 탄생했기 때문이다. 더 중요한 것은 GPT-3가 개별 NLP의 다운스트림 태스크를 수행하는 기존의 패러다임을 바꾼 것이다. 기존의 NLP 태스크는 개별 태스크에 맞게 모델을 Fine-tuning하는 과정으로 진행됐다. 그러나 GPT-2에서 암시하고 있듯이, GPT는 모델의 크기를 늘려 Fine-tuning 없이 다양한 자연어처리 태스크를 처리할 수 있는 General model의 개발에 집중해왔다. 결국 GPT-3는 파라미터 사이즈를 늘린 언어모델이 `Few-shot` 기법을 활용하면 Fine-tuning을 한 모델만큼 훌륭한 성능을 낼 수 있다는 것을 보여준다. 해당 글은 OpenAI의 [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) 논문의 핵심 개념을 중심으로 설명한다.

### Introduction

2020년 당시 NLP 다운스트림 태스트를 수행하는 방법은 태스크에 맞는 Fine-tuning을 하는 것이다. 하지만, 이 방법의 제한점은 3가지로 정리할 수 있다.

- 첫째, 실용성 측면에서 NLP 태스크(예: grammer check, abstract)에 맞는 대규모의 지도 학습 데이터는 구하기 어렵다.
- 둘째, 포괄적으로 학습된 언어모델이 Fine-tuning을 거쳐 특정 분야에 특화된 모델로 제한된다. 즉, pre-train을 통해 포괄적인 정보를 흡수할 수 있는 언어모델이 매우 좁은 태스크를 수행하도록 미세조정된다는 것이다.
- 셋째, 인간의 사고방식은 지도 학습 데이터가 필요한 형태로 작동하지 않는다. 인간은 자연어로 표현된 간단한 지시(예: 이 문장이 행복한지 슬퍼보이는지 구분해줘)나 적은 수의 예시(예: 인간이 용감하게 행동하는 것은 다음과 같이 2가지의 예시가 있어. 용감함에 대한 세번째 예시를 만들어줄래?)로 충분히 문제를 해결할 수 있다.

이를 위해 GPT-3는 메타학습(meta-learning)이라는 아이디어를 제시한다.

#### meta-learning과 in-context learning

언어모델 관점에서 메타학습은 학습 시 광범위한 기술(skill)과 패턴 인식 능력(pattern recognition abilities)을 습득하고, 특정 태스크에 맞게 이 능력을 사용할 수 있다는 개념이다. 이 맥락에서 문맥 내 학습(in-context learning)은 사전학습된 언어모델의 텍스트 input이 개별 태스크에 대한 사양(task specification)의 형태로 사용된다는 것을 의미한다. 다음 그림으로 메타학습과 문맥 내 학습의 의미를 풀어서 설명한다.

<figure>
    <img src="/llm-gpt-3-review/in-context-learning.png" title="in-context learning">    
    <figcaption style="text-align: center;">Meta learning과 in-context learning (Brown et al., 2020)</figcaption>
</figure>

위의 그림에서 메타학습은 outer loop와 inner loop의 구조를 감지할 수 있는 능력이다. 비지도학습을 통해 가중치를 업데이트하는 전체의 과정이 outer loop라고 한다면, 유사한 패턴을 가진 시퀀스들의 모음이 inner loop가 된다. 여기서 문맥 내 학습은 메타학습의 inner loop를 지칭한다. 즉, 문맥 내 학습이 개별 태스크에 대한 사양이라는 것은 단일 시퀀스 내에서 반복적으로 포함되는 하위 태스크(sub-task)가 존재한다는 것이다. 여기서 추후 나올 개념인 `Few-shot`, `One-shot`, `Zero-shot`은 메타학습을 통해 언어모델이 inner loop를 감지하는 과정에서 하위태스크와 관련된 예시를 어느 정도 제공할 것인지에 대한 개념이다.

#### Few-Shot과 One-Shot, Zero-Shot

저자들은 언어모델이 문맥 내 학습 능력을 갖고 있다고 가정하고 GPT-3를 포함한 언어모델로 이를 평가한다. GPT-3를 평가하는 3가지 조건은 다음과 같다.

- `few-shot learning`: 개별 태스크에 대해 모델의 문맥 window(10에서 100개 정도)에 맞는 만큼의 예시를 제공한다.
- `one-shot learning`: 개별 태스크에 맞는 하나의 예시만 제공한다.
- `zero-shot learning`: 예시를 제공하지 않고 자연어로 된 명령어만 제공한다.

다음 그림은 3가지 조건에 따른 성능 결과다. 그림은 (1) `few-shot learning`으로 모델에 제공하는 예시의 수를 늘릴수록, (2) 모델의 파라미터 수가 증가할수록 모델의 성능이 높아진다는 것을 의미한다. 즉, 가중치를 업데이트하거나 Fine-tuning하지 않고 언어모델에 충분한 예시를 제공해주는 것만으로도 좋은 성능을 제공할 수 있다는 것이다. 언어모델의 파라미터 사이즈가 증가할수록 `few-shot learning`의 효과는 더욱 커질 수 있다.

<figure>
    <img src="/llm-gpt-3-review/n-shot-learning-perfom.png" title="in-context learning performance">    
    <figcaption style="text-align: center;">문맥 내 학습 효과 (Brown et al., 2020)</figcaption>
</figure>

### Approach

GPT-3의 사전학습 과정은 GPT-2와 상당히 유사하다. 즉, 모델 아키텍처 차원에서 큰 변화는 없지만, 모델의 파라미터 사이즈를 늘리는 방향으로 GPT-3를 학습하고 있다. GPT-2와 큰 차이점은 문맥 내 학습이기 때문에, 문맥 내 학습을 중심으로 GPT-3를 설명한다.

<figure>
    <img src="/llm-gpt-3-review/shot-learning-example.png" title="fine-tuning vs. n-shot">    
    <figcaption style="text-align: center;">Fine-tuning과 비교한 Zero-shot, one-shot, few-shot (Brown et al., 2020)</figcaption>
</figure>

구체적으로 `Fine-tuning`과 `few-shot`, `one-shot`, `zero-shot`을 설명한 내용은 위의 그림과 같다.

- Fine-tuning: 그림의 오른쪽이 전통적으로 모델을 미세조정하는 방법이다. gradient를 갱신하는 방법으로 파라미터가 업데이트된다. fine-tuning의 장점은 여러 개의 벤치마크에서 가장 강력한 성능을 보인다는 것이다. 그러나, Fine-tuning을 위해 대규모의 지도학습 데이터가 필요하고, 훈련 데이터에 과적합될 수 있는 특징이 있다. (GPT-3는 fine-tuning하지 않은 모델이기 때문에, GPT-3의 파인튜닝은 향후 연구로 남아있다고 설명한다.)
- `Few-shot learning`: 그림의 왼쪽 하단이 `Few-shot`의 방법이다. 특정 태스크에 대한 자연어 명령과 함께 몇가지의 사례를 제공한다. 태스크별로 학습 데이터를 만들지 않아도 되지만, 아직은 Fine-tuning한 모델보다 성능은 낮다고 설명한다.
- `One-shot learning`: 자연어 설명과 함께 1개의 예시만 제공한다. `One-shot`은 사람이 태스크를 수행하는 방식과 비슷하다. 특정한 태스크에 대해 주어진 사례가 제공되는 방식이 실제로 지도학습 데이터를 만드는 방식과 유사하다.
- `Zero-shot learning`: 예시 없이 모델에 태스크를 설명하는 자연어 명령만 제공한다. 어떻게 보면 사람이 예시 없이 태스크를 이해하기 어려운 것과 같을 수 있다. 한편으로, 번역과 같은 태스크에서 사람이 수행하는 방법과 비슷하다.

결론적으로 `Few-shot learning`의 성능은 Fine-tuning을 기반의 `SOTA` 모델에 비견될 수 있다고 설명한다.

#### Model and Architectures

GPT-3는 GPT-2와 동일한 모델과 아키텍처를 사용한다. 모델 사이즈에 따른 성능 평가를 위해 GPT-3를 포함한 8개의 모델이 개발된다. 모델의 개별 사양은 다음 그림과 같다. $n_{params}$는 학습 파라미터의 개수, $n_{layers}$은 layer의 개수, $d_{model}$은 개별 bottleneck layer에서 unit의 개수, $d_{head}$는개별 attention head의 차원을 의미한다. 모든 모델은 문맥 window($n_{ctx}$)가 2048개의 토큰이다. 아래 그림의 마지막에 있는 175B의 파라미터를 가진 모델이 GPT-3다.

<figure>
    <img src="/llm-gpt-3-review/gpt-3-models.png" title="gpt3 models">    
    <figcaption style="text-align: center;">8개의 GPT 모델(Brown et al., 2020)</figcaption>
</figure>

#### Training Dataset

GPT-3 학습에 사용된 데이터세트는 다음 그림과 같다. 가장 많이 포함된 데이터세트는 Common Crawl 데이터세트로 약 1조개의 단어를 포함한다. 하지만, Common Crawl 데이터세트는 품질이 낮기 때문에, 낮은 품질의 데이터를 필터하거나 중복을 제거하는 방식을 사용했다. 추가적으로 고품질의 데이터세트를 포함해 데이터의 오염(contamination)을 막으려 했다. 고품질이 좋은 데이터세트는 여러 번 학습하고, 저품질의 데이터세트는 적게 학습한다. 예를 들어, Common Crawl과 Books2는 1보다 낮은 에포크만큼 학습되지만, WebText2와 Books1, Wikipedia는 1보다 높은 정도로 더 자주 샘플링된다.

<figure>
    <img src="/llm-gpt-3-review/training-datasets.png" title="datasets used to train GPT-3">    
    <figcaption style="text-align: center;">GPT-3 학습에 사용된 데이터세트(Brown et al., 2020)</figcaption>
</figure>

### Results

GPT-3의 결과는 개별 자연어처리 태스크마다 `SOTA`와 8개의 GPT 모델의 `few-shot`, `one-shot`, `zero-shot`의 성능을 비교한다. 평가 결과는 자연어처리 태스크를 9개로 묶어 설명한다. 9개 영역에서 GPT-3는 전반적으로 `SOTA` 보다 우수하지 않지만, 비견될 수 있는 성능을 보인다. 특히, `Few-shot`과 `One-shot`, `zero-shot`의 순서대로 성능이 뛰어나다고 설명한다.

### 참고문헌

- Brown, T. B., Mann, B., Ryder, N., Subbiah, M., Kaplan, J., Dhariwal, P., Neelakantan, A., Shyam, P., Sastry, G., Askell, A., Agarwal, S., Herbert-Voss, A., Krueger, G., Henighan, T., Child, R., Ramesh, A., Ziegler, D. M., Wu, J., Winter, C., … Amodei, D. (2020). Language Models are Few-Shot Learners. arXiv. https://doi.org/10.48550/arxiv.2005.14165
