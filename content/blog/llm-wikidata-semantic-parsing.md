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

기존의 LLM은 학습 과정에서 SQL과 같은 형식적인 질의 언어를 많이 학습했기 때문에 이와 같은 질의 언어 문법에 익숙하다. 예를 들어, SQL schema가 있다면 간단한 자연어 질의를 부가적인 설명 없이 SQL 형태로 바꿔주는 것(zero-shot semantic parsing)이 가능하다. 그러나, 이 논문에서 강조하는 것은 wikidata가 미리 정의된 schema가 없기 때문에 자연어 질의를 SPARQL 질의로 바꾸는 작업이 어렵다고 설명한다. 물론, LLM은 zero-shot으로 SPARQL 질의가 가능하지만, wikidata에 있는 모든 PID와 QID를 알고 있지 않고 프롬프트 상에서 모든 ID를 포함해서 질의할 수 없다고 설명한다. 따라서 이 논문은 사용자 질의를 SPARQL 쿼리로 직접 변환하는 wikidata용 few-shot seq2seq semantic parser인 WikiSP(semantic parser)를 제안한고 있다.

이 논문에서 두드러진 공헌점은 다음의 2가지와 같다:

- wikidata를 위한 고품질의 semantic parsing 데이터세트인 WikiWebQuestions의 구축: freebase를 기반으로 만들어진 기존의 KBQA(Knowledge Base Question Answering) benchmark 데이터세트(WebQuestionsSP)를 wikidata에 맞게 변환하고, 최신의 SPARQL 질의와 이에 대한 응답으로 업데이트한 WikiWebQuestions 데이터세트를 구축했다.
- few-shot seq2seq semantic parser인 WikiSP의 개발: few-shot training set으로 LLaMA를 파인튜닝한 semantic parser인 WikiSP를 개발했다. 이 semantic parser는 자연어 질의로부터 entity를 추출하는 entity linker의 결과를 보완하고, PID 또는 QID를 이름 형태로 대체한 SPARQL 질의로 변환하는 역할을 수행한다.

### WikiWebQuestions

wikidata는 가장 활발히 사용되고 있는 knowledge base이지만, KBQA 분야에서 wikidata를 기반으로 만들어진 벤치마크 데이터세트는 규모가 작거나 품질이 낮다. 반면, freebase는 더 이상 사용되지 않지만, 가장 대표적으로 사용되는 벤치마크 데이터세트(예: WebQuestionsSP)가 freebase 기반으로 구축되었다. 연구자들은 Google의 entity mapping과 wikidata의 relation mapping의 도움을 받아 freebase 기반의 WebQuestionsSP를 wikidata로 마이그레이션했다. 데이터세트의 약 60%가 자동으로 변환되었고, 자동 변환에 실패한 인스턴스는 매뉴얼하게 변환했다고 한다.

### WikiPS

- (1) entity linker로부터 누락된 QID도 찾을 수 있도록 한다. (2) 이름을 바꾼 SPARQL로 변환하게 한다.
- Entity linking은 질의에서 named entity를 찾는 방법과 관련된 것으로 지식그래프에 있는 관련된 entity와 연결하면서 참조 포인트가 되는 적절한 엔티티를 사용해 질의을 수행할 수 있음
- 현재 WebQuestionsSP 데이터세트에 대한 SOTA entity linking 모델은 ReFinED(참고 논문)임
- - 형식적으로 유저가 input $T$ 를 줄 때, entity linker는 $<e,q>$ 를 제공함
    - 여기서 $e$는 위키데이터에 있는 엔티티의 이름 (default label)이고, $q$ 는 QID이며, semantic parser는 수정된 SPARQL 형식으로 $T$ 에 대한 semantic parse를 생성함
      예를 들어, SOTA ReFinED entity linker는 $<General Motors, Q81965>$ 를 도출하나 entity automobile model (Q3231690)은 누락함
- entity linker로부터 가져온 결과는 일부 맞지만 누락이 생김

- semantic parser는 entity linker에서 잠재적으로 유용한 QID의 선택적 집합을 허용하도록 훈련됨. 즉, gold 답변에 사용되지 않은 sample과 원래 쿼리의 언급을 사용함
- llm이 도메인과 속성에 대해 QID와 PID를 기억하는 게 불가능하다고 가정함 -> PID 대신 더 기억하기 쉬운 속성 이름을 사용해 SPARQL 쿼리 형식을 수정함. domain에 대해서도 entity name을 사용함
- sparql 구문의 변화

<figure class="flex justify-center">
  <!-- <figcaption>Overview (Xu et al., 2023)</figcaption> -->
  <img src="/llm-wikidata-semantic-parsing/overview.png" title="Overview">    
</figure>
