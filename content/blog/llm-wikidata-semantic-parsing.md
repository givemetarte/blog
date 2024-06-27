---
title: 논문 리뷰 | Fine-tuned LLMs Know More, Hallucinate Less with Few-Shot Sequence-to-Sequence Semantic Parsing over Wikidata
description: LLM의 hallucination에 대응하기 위해 사실정보를 담고있는 지식 베이스를 활용하려는 논의가 다양하다. LLM의 truthness를 향상시키기 위해 자연어 질의에서 entity를 추출해 지식 베이스로부터 적합한 데이터를 추출해오는 방법에 대해 알아보자.
slug: llm-wikidata-semantic-parsing
author: 박하람
category: NLP/LLM
datetime: 2024. 06. 26.
language: Korean
featured: None
tags:
  - wikidata
  - entity linking
  - semantic parser
---

LLM의 hallucination에 대응하기 위해 다양한 방법이 논의되고 있지만, 오늘은 이 중에서 대규모의 사실 정보를 담고 있는 지식 베이스를 활용하는 방안에 대해 알아본다. 오늘 리뷰할 논문은 [Fine-tuned LLMs Know More, Hallucinate Less with Few-Shot Sequence-to-Sequence Semantic Parsing over Wikidata](https://arxiv.org/abs/2305.14202)로, 2023년 5월에 처음 publish된 논문이다. 이 논문 리뷰는 자연어 질의에서 entity를 추출해 knolwedge base로부터 적절한 데이터를 가져오는 과정에 초점을 둔다.

### Overview

기존의 LLM은 학습 과정에서 SQL과 같은 형식적인 질의 언어를 많이 학습했기 때문에 질의 언어 문법에 익숙하다. 예를 들어, SQL schema가 있다면 간단한 자연어 질의를 부가적인 설명 없이 SQL 형태로 바꿔주는 것(zero-shot semantic parsing)이 가능하다. 그러나, 이 논문에서 강조하는 것은 wikidata가 미리 정의된 schema가 없기 때문에 자연어 질의를 SPARQL 질의로 바꾸는 작업이 어렵다고 설명한다. 물론, LLM은 zero-shot으로 SPARQL 질의가 가능하지만, wikidata에 있는 모든 PID와 QID를 알고 있지 않고 프롬프트 상에서 모든 ID를 포함해서 질의할 수 없다고 설명한다. 따라서 이 논문은 사용자 질의를 SPARQL 쿼리로 직접 변환하는 wikidata용 few-shot seq2seq semantic parser인 WikiSP(semantic parser)를 제안하고 있다.

이 논문에서 두드러진 공헌점은 다음의 2가지와 같다:

- **wikidata를 위한 고품질의 semantic parsing 데이터세트인 WikiWebQuestions의 구축**: freebase를 기반으로 만들어진 기존의 KBQA(Knowledge Base Question Answering) benchmark 데이터세트(WebQuestionsSP)를 wikidata에 맞게 변환하고, 최신의 SPARQL 질의와 이에 대한 응답으로 업데이트한 WikiWebQuestions 데이터세트를 구축했다.
- **few-shot seq2seq semantic parser인 WikiSP의 개발**: few-shot training set으로 LLaMA를 파인튜닝한 semantic parser인 WikiSP를 개발했다. 이 semantic parser는 자연어 질의로부터 entity를 추출하는 entity linker의 결과를 보완하고, PID 또는 QID를 이름 형태로 대체한 SPARQL 질의로 변환하는 역할을 수행한다.

### WikiWebQuestions

wikidata는 가장 활발히 사용되고 있는 knowledge base이지만, KBQA 분야에서 wikidata를 기반으로 만들어진 벤치마크 데이터세트는 규모가 작거나 품질이 낮다. 반면, freebase는 더 이상 사용되지 않지만, 가장 대표적으로 사용되는 벤치마크 데이터세트(예: WebQuestionsSP)가 freebase 기반으로 구축되었다. 연구자들은 Google의 entity mapping과 wikidata의 relation mapping의 도움을 받아 freebase 기반의 WebQuestionsSP를 wikidata로 마이그레이션했다. 데이터세트의 약 60%가 자동으로 변환되었고, 자동 변환에 실패한 인스턴스는 매뉴얼하게 변환했다고 한다.

### WikiPS

이 논문에서 WikiPS의 역할은 자연어 질의에서 entity linker로 추출한 QID의 결과를 보완하고, 이를 효과적으로 가져올 수 있는 SPARQL 질의로 변환하는 과정이다. 이 과정에 대한 도식화는 다음과 같다:

<figure class="flex justify-center">
  <!-- <figcaption>Overview (Xu et al., 2023)</figcaption> -->
  <img src="/llm-wikidata-semantic-parsing/overview.png" title="Overview">    
</figure>

Entity Linker는 자연어 질의에서 관련된 named entity를 찾는 것으로, 이 논문은 WebQuestionsSP 데이터세트의 SOTA인 ReFinED[^1]를 사용하고 있다. 사용자가 input으로 자연어 질의인 $T$ 를 줄 때, entity linker는 $<e,q>$ 를 제공한다. 이 때, $e$ 는 위키데이터에 있는 엔티티의 이름(default name)이고, $q$ 는 QID다.

그러나, 이 논문에서 강조하는 것은 entity linker가 추출하는 entity의 일부가 missing된다는 것이다. 예를 들어, "월드 시리즈에서 자이언츠가 언제 우승했나?(What year did giants win the world series?)"라는 자연어 질의에서 정답 엔티티의 결과는 "World Series (QID Q265538)"과 "San Francisco Giants (QID Q308966)"이다. 그러나, ReFinED 결과는 "San Francisco Giants (QID Q308966)"만 가져오기 때문에, WikiSP가 entity linker의 실패에 대해 보완할 수 있는 방법을 제공해야 한다고 설명한다.

한편, 연구자들은 LLM이 위키데이터의 도메인과 속성에 대해 QID와 PID를 기억하는 게 불가능하다고 가정한다. 그렇기 때문에 PID 대신 더 기억하기 쉬운 속성 이름과 엔티티 이름을 사용해 SPARQL 쿼리를 수정하는 작업을 수행한다. 예를 들어, 아래의 SPARQL 질의는 PID와 QID를 사용해 데이터를 추출한 오리지널의 질의다.

```sparql
SELECT DISTINCT ?x WHERE {
  ?x wdt:P31/wdt:P279* wd:Q3231690 .
  ?x wdt:P176 wd:Q81965 .
}
```

연구자들은 P31와 Q3231690과 같은 PID, QID 형태가 LLM이 기억하기 어려운 형태라 판단해, 다음과 같이 속성의 이름이나 엔티티명으로 SPARQL 질의하는 과정을 WikiSP에 포함했다. SPARQL 질의문을 변형하기 위해 7B LLaMA를 fine-tuning했고, self-instruct 방식을 사용해 WikiWebQuestion의 샘플 데이터를 아래와 같은 방식으로 수정한다.

```sparql
SELECT DISTINCT ?x WHERE {
  ?x wdt:instance_of/wdt:subclass_of* wd:automobile_model .
  ?x wdt:manufacturer wd:Q81965 .
}
```

이와 같은 맥락에서 WikiSP의 역할은 (1) entity linker에서 놓친 QID를 찾고, (2) PID나 QID가 아닌 이름을 기반으로 작성된 entity를 추출하는 SPARQL 질의문을 생성한다. 이렇게 생성된 SPARQL 질의문은 wikidata endpoint로 질의하는 데 사용된다.

### 정리하며

이 논문을 흥미롭게 읽은 것은 자연어 질의에 부합하는 이름 기반의 SPARQL 질의문을 생성하는 방식이다. 이 논문에서 언급한 것처럼 대규모의 지식 베이스는 strict한 schema가 있기 보다 PID 또는 QID 방식으로 만들어질 것이라 생각하는데, 이를 LLM이 학습 가능한 방식으로 바꾸기 위해 이름 기반의 SPARQL 질의문으로 바꾼 것이 흥미로웠다. 그러나, wikidata endpoint에서 이렇게 이름으로 바꾼 질의문이 직접 쿼리가 가능한건지 의문은 들었다. 무엇보다 더 관심 있었던 부분은 entity linker의 작동 방식인데, Ayoola(2022)의 ReFinED를 파인튜닝 했다고만 설명하고 있어 추가적으로 논문을 살펴봐야 겠다고 생각했다. 특정 도메인 분야에서 LLM의 정확성을 높이기 위해 고품질의 사실정보를 구축한 지식 베이스가 있다면, 자연어 질의에 맞게 지식 베이스의 데이터를 가져오는 방법에 대한 인사이트를 얻을 수 있어서 개인적으로 만족한다.

[^1]: Ayoola, T., Tyagi, S., Fisher, J., Christodoulopoulos, C., & Pierleoni, A. (2022). ReFinED: An Efficient Zero-shot-capable Approach to End-to-End Entity Linking (No. arXiv:2207.04108). arXiv. https://doi.org/10.48550/arXiv.2207.04108
