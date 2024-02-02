---
title: 논문 리뷰 | PEFT의 대표적인 사례인 Prompt Tuning 알아보기
description: HuggingFace의 PEFT 중 하나로 지원하는 Prompt Tuning에 대해 알아보자. Prompt Tuning을 제안한 논문인 The Power of Scale for Parameter-Efficient Prompt Tuning을 읽고 리뷰한다.
slug: llm-prompt-tuning
author: 박하람
category: NLP/LLM
datetime: 2024. 01. 26.
language: Korean
featured: None
tags:
  - PEFT
  - Prompt Tuning
  - Prefix Tuning
---

`PEFT`(Parameter-Efficient Fine-Tuning)은 모델의 일부의 파라미터를 파인 튜닝함으로써 다운스트림 태스크에 효율적으로 언어모델을 파인튜닝할 수 있는 방법이다. 즉, 언어모델의 전체 파라미터를 파인튜닝하지 않아도 전체 파라미터를 파인튜닝한 것과 같이 효율적인 성능을 낼 수 있는 방법이 `PEFT`다. HuggingFace에 나와있는 대표적인 사례는 `LoRA`, `Prefix Tuning`, `P-Tuning`, `Prompt Tuning`이 있다[^1]. 오늘 포스팅은 `Prompt Tuning`에 대해 알아본다. `Prompt Tuning`을 제안한 논문인 [The Power of Scale for Parameter-Efficient Prompt Tuning](https://doi.org/10.48550/arxiv.2104.08691)을 기반으로 설명한다.

### Overview

`Prompt Tuning`은 `Prefix Tuning`과 아이디어가 비슷하지만, 전반적으로 간소화한 형태의 파인튜닝 방법이다. `Prompt Tuning`은 특정한 다운스트림 태스크를 수행하기 위해 언어모델의 가중치를 고정하고, 개별 태스크마다 프롬프트의 파라미터를 업데이트하는 `Soft Prompt`의 학습 방식을 사용한다. 즉, `Prefix Tuning`과 비슷하게 언어모델의 가중치는 그대로 두고 태스크별로 input 값에 프롬프트를 붙여 학습시키는 방법이다.

#### Hard Prompt vs. Soft Prompt

이 논문을 읽을 때 Hard prompt와 Soft prompt의 개념을 이해하는 것이 중요하다. 해당 내용에 대한 정리는 [프롬프트 러닝, Prompt Learning이란?](https://codingsmu.tistory.com/162)의 블로그 내용을 적극 참고했다.

프롬프트의 학습 방법은 크게 Hart prompt와 Soft prompt로 구분한다. Hard prompt는 input의 특성에 따라 input 값이 미리 정의된 텍스트 템플릿으로 바뀐다(그림 (a)). 즉, Positive, Negative와 같이 주로 자연어 형태의 이산적인(discrete) 값을 갖는다. 그러나, 언어모델은 이산적인 값이 아닌 연속적인 값으로 학습되기 때문에 hard prompt는 최적화되지 않는다는 단점이 있다. 반면, Soft prompt는 input 앞에 튜닝이 가능한 임베딩 조각(tunable piece of embedding)이 붙게 된다(그림 (b)). 이 임베딩 조각은 실수(real number)로 이루어진 연속적인(continuous) 값으로 학습되고, 기존의 hard prompt 학습에 비해 더 효과적인 학습이 가능하다.

<figure>
    <img src="/llm-prompt-tuning/soft-prompt.png" title="hard prompt vs. soft prompt">    
    <figcaption style="text-align: center;">Hard Prompt vs. Soft Prompt (Senadeera & Ive, 2022)</figcaption>
</figure>

## Prompt Tuning

다음 그림은 Prompt Tuning과 Model Tuning을 비교해 설명한다. Model Tuning은 언어모델의 모든 파라미터를 튜닝하는 방법으로, 태스크 A와 B, C에 맞게 모든 파라미터를 튜닝해야 한다. 그러나, Prompt Tuning은 기존의 학습된 모델의 가중치는 고정하고 태스크 A와 B, C에 맞게 input 텍스트($e.g., a1, b1, c1$)에 추가적인 $k$ 개의 튜닝이 가능한 토큰($e.g., A, B, C$)을 붙인다.

<figure>
    <img src="/llm-prompt-tuning/prompt-tuning.png" title="prompt tuning vs. model tuning">    
    <figcaption style="text-align: center;">Model Tuning과 Prompt Tuning의 비교(Lester et al., 2021)</figcaption>
</figure>

다음의 수식으로 Prompt Tuning을 직관적으로 이해해보자.

① $Pr(y \,|\, X)$ $\to$ ② $Pr_{\theta}(Y \,|\, X)$ $\to$ ③ $Pr_{\theta}(Y \,|\, [P;X])$ $\to$ ④ $Pr_{\theta; \theta_P}(Y \,|\, [P; X])$

- ①의 수식: 기존의 hard prompt는 $X$란 일련의 input 토큰이 존재할 때, $y$라는 단순한 class label을 예측한다. 예를 들어, $y$는 Positive, Negative와 같은 단순한 문자열이 해당된다.
- ②의 수식: soft prompt는 hard prompt에서 자연어로 표현된 결과와 달리, $Y$라는 class label이 표현된 토큰 시퀀스를 예측한다. 즉, 이산적인 결과를 예측하기 보다 연속적인 값을 예측하는 것이라 해석할 수 있다. 학습의 결과는 input에 대한 출력 클래스의 확률로 표현되고, 가중치인 $\theta$가 매개변수화된다.
- ③의 수식: Prompting은 $Y$의 생성에 조건을 주기 위해 모델에 부가적인 정보를 추가하는 방법이다. 모델 파라미터인 $\theta$는 고정된 채로, 프롬프트라는 부가적인 정보는 $P$라는 일련의 토큰으로 표현된다. 이 $P$는 input 토큰인 $X$의 앞에 붙는다.
- ④의 수식: 최적의 프롬프트를 찾는 것은 프롬프트 토큰 중에서 선택을 해야한다는 의미다. Prompt tuning은 $\theta$로 파라미터화된 프롬프트 $P$의 제한을 없애고, 프롬프트에 대한 추가 파라미터인 ${\theta}_P$로 가중치를 업데이트한다. 즉, Prompt Tuning은 ${\theta}_P$가 gradient descent로 업데이트되면서 역전파(backpropagation)를 통해 $Y$의 확률을 최대화하는 방향으로 학습한다.

### 고려사항

Prompt Tuning의 고려사항은 다음의 2가지와 같다.

- Prompt 표현의 초깃값을 무엇으로 할 것인가?

Prompt 표현의 초깃값은 3가지 방법이 있다. 첫번째 방법은 무작위 초기화(random initialization)를 사용해 처음부터 모델을 훈련하는 것이다. 두번째 방법은 개별 프롬프트 토큰을 모델의 vocabulary에서 추출한 임베딩으로 초기화하는 것이다. 세번째는 프롬프트를 출력 클래스를 나열하는 임베딩으로 초기화하는 방법이다. 테스트 결과에 따르면, 무작위 초기화를 해주는 것보다 vocabulary 또는 출력 클래스의 임베딩으로 초기화를 해주는 것이 더 좋은 성능이 나왔다.

- Prompt의 길이를 얼마로 할 것인가?

Prompt의 길이를 위한 파라미터의 비용은 $EP$로 계산한다. $E$는 토큰 임베딩의 차원이고, $P$는 프롬프트의 길이다. 프롬프트의 길이가 더 짧을수록, 새로운 파라미터가 더 적게 튜닝되어야 한다. 연구결과에 따르면, Prompt의 길이는 5~100 사이의 값이 적절한 것으로 나왔다.

### Results

Prompt Tuning의 성능은 아래의 왼쪽 그림과 같다. Prompt Tuning은 모델의 크기가 커질수록 성능이 향상된다. 특히, 모델의 크기가 수십억 개의 파라미터를 초과하는 경우, Model Tuning과 거의 동일한 성능을 보인다.

오른쪽의 그림은 파인 튜닝에 필요한 파라미터의 개수를 비교한 결과다. Model Tuning이 100%의 파라미터를 갖고 있다면, Prompt Tuning은 0.001%의 파라미터를 가지고 Model Tuning만큼의 성능을 낼 수 있다. Prefix Tuning이 0.1%로 파라미터를 학습하는 것과 비교할 때, Prompt Tuning은 아주 적은 파라미터로 효율적인 Fine-Tuning이 가능해진다. 즉, Prompt Tuning이 대규모의 언어모델을 특정한 다운스트림 태스크에 적용하는 데 효율적으로 사용될 수 있다.

<figure>
    <img src="/llm-prompt-tuning/results.png" title="Performances per Tuning">    
    <figcaption style="text-align: center;">Prompt Tuning을 이용한 모델의 성능과 파라미터 개수(Lester et al., 2021)</figcaption>
</figure>

### 다른 PEFT 방법과 비교

- Prefix tuning

Prefix tuning은 모든 트랜스포머 레이어에 접두어 시퀀스를 붙여 학습시키는 방법이다. Prefix tuning은 트랜스포머의 모든 계층에 접두어를 붙이는 반면, Prompt Tuning은 input 앞에 접두어를 붙여 하나의 프롬프트 표현을 사용한다. 즉, Prompt Tuning은 Prefix tuning 보다 더 적은 파라미터로 모델의 Fine-Tuning이 가능하다. 예를 들어, `BART`를 사용할 때, Prefix tuning은 인코더와 디코더 네트워크에 모두 접두사를 붙인다. 그러나, Prompt Tuning은 인코더의 프롬프트에만 접두어를 붙인다.

- P-tuning

P-tuning은 인간이 디자인한 패턴을 사용해 학습이 가능한 연속적인 prompt를 input 전체에 삽입하는 방법이다. P-tuning은 입력 전체에 연속적인 prompt를 삽입하는 반면, Prompt Tuning은 접두어로 붙이기 때문에 P-tuning보다 단순해진다. 또한, P-tuning은 프롬프트와 모델의 주요 파라미터를 같이 업데이트하는 반면, Prompt Tuning은 언어모델을 고정된 상태로 사용하기 때문에 더 효율적이다.

### 참고자료

- Lester, B., Al-Rfou, R., & Constant, N. (2021). The Power of Scale for Parameter-Efficient Prompt Tuning. arXiv. https://doi.org/10.48550/arxiv.2104.08691
- Senadeera, D. C., & Ive, J. (2022). Controlled Text Generation using T5 based Encoder-Decoder Soft Prompt Tuning and Analysis of the Utility of Generated Text in AI. arXiv. https://doi.org/10.48550/arxiv.2212.02924
- 프롬프트 러닝, Prompt Learning이란?, 코딩 스뮤 [[바로가기]](https://codingsmu.tistory.com/162)

[^1]: https://github.com/huggingface/peft
