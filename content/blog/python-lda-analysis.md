---
title: 파이썬으로 LDA 중심의 토픽 모델링 분석하기
description: 파이썬의 라이브러리 gensim을 활용해 LDA 모델을 학습하고, pyLDAvis를 사용해 토픽의 분포를 시각화해보자.
slug: python-lda-analysis
author: 박하람
category: Python
datetime: 2024. 05. 03.
language: Korean
featured: None
tags:
  - LDA
  - pyLDAvis
  - topic modeling
  - gensim
---

수업 과제로 텍스톰을 활용해 LDA를 활용한 토픽 모델링을 수행하는 것이 나왔다. 개인적으로 자연어처리 분석에서 텍스톰을 사용하는 것을.. 왕 비추천하지만, 수업의 과제이기 때문에 실행은 해봤다. 그런데 4.29~4.30까지 DB 통합 작업을 진행한다면서 이전에 분석해놨던 건 다 날라가고!!! 새로 해도 분석이 정말 더럽게 안됐다. 어쩔 수 없이(?) 빠르게 파이썬으로 돌렸다. 결론은 Colab에 있는 생성형 AI를 잘 활용할 수 있다면 충분히 파이썬에서도 분석할 수 있을 것이라 생각한다.

이 포스팅은 LDA 알고리즘으로 토픽 모델링을 수행하기 위한 과정을 담았다. 이 포스팅에 사용한 코드는 [Google Colab](https://colab.research.google.com/drive/1pdi5PNbaVkJuhKZLTigdn6mDom4C2Syd?usp=sharing)에서 확인할 수 있다. 전반적으로 참고한 블로그 글은 [pyLDAvis를 이용한 Latent Dirichlet Allocation 시각화하기](https://lovit.github.io/nlp/2018/09/27/pyldavis_lda/#topic=0&lambda=1&term=)다. 포스팅에서 사용한 gensim과 LDAvis에 대해 잘 설명해주고 있다. 데이터 정제 이후 LDA 학습시키는 코드는 [토픽모델링 최적 갯수 선정](https://blog.naver.com/PostView.naver?blogId=kum2146&logNo=222156272986&parentCategoryNo=&categoryNo=&viewDate=&isShowPopularPosts=false&from=postView) 글에서 가져왔다.

### 분석 주제

'디지털 아카이브'와 관련된 논문의 연구 동향을 파악하기 위해 토픽 모델링을 진행한다. KCI에서 '디지털 아카이브'와 관련된 논문 496건을 수집하고(키워드 검색 결과), '제목'과 '초록'을 LDA 분석에 사용한다. 데이터 수집에 대한 내용은 [이전 포스팅](/blog/python-kci-abstract-crawling)에서 확인할 수 있다.

### 데이터 정제

LDA 분석하기 전까지 데이터를 정제하고 토큰을 뽑아내는 과정은 Colab의 생성형AI 기능을 사용했다. 해당 코드에 `# prompt:`라 적혀있는 코드는 생성형 AI 코드를 그래도 사용하거나 일부 수정한 코드다. 다음과 같이 '논문명'과 '초록'을 합친 새로운 컬럼을 추가한 다음, 문자열로 모두 형식을 변환한다.

```py
import pandas as pd

df = pd.read_csv('../KCI-디지털아카이브-초록추가-240318.csv', encoding='utf-8')
df = df[['논문ID','논문명','초록']]
df['doc'] = df['논문명'] + df['초록']
df['doc'] = df['doc'].apply(lambda x: str(x))
```

### 토큰화 하기

`df['doc']`을 대상으로 토큰화를 진행한다. 토크나이저는 빠르게 분석하기 위해 [Kiwi](https://github.com/bab2min/Kiwi)를 사용했다. 다음의 코드와 같이 토큰화한 후 'NN'으로 시작하는 태그가 달린 토큰만 가져오게 했다. 심각한 분석(?)은 아니라 간단히 명사형만 추출했다. 추출된 토큰 중 한글자는 제외하고 `df['doc_clean']`에 저장한다.

```py
# prompt: doc을 kiwi 형태로 분석기로 token.tag.startswith('NN') 명사만 추출해줘

from kiwipiepy import Kiwi

kiwi = Kiwi()
df['doc_token'] = None

for idx, row in df.iterrows():
    doc = row['doc']
    nouns = []
    for sentence in kiwi.analyze(doc):
        for token in sentence[0]:
            if token.tag.startswith('NN'):
                nouns.append(token.form)
    df.at[idx, 'doc_token'] = nouns

df['doc_clean'] = df['doc_token'].apply(lambda x: [word for word in x if len(word) > 1])
```

다음은 불용어를 제거하는 과정이다. 논문에서 일반적으로 사용되는 '연구', '분석', '방안' 등과 같은 단어는 의미없기 때문에, 불용어로 처리해 제거한다. 여기까지 수행하면 아주 간단하게 LDA를 분석하기 위한 데이터 작업이 완료된다.

```py
# prompt: doc_clean에서 불용어를 제거하고 싶은데, stop_words라는 리스트에 담긴 불용어가 제거됐으면 좋겠어.

stop_words = ['연구','분석','방안','중심','관련','필요','가능','기반','제시','방법','결과','대상','의미','논문','분야','목적','중요', \
              '조사','제안','내용','인식','바탕','방식','작업','논의','수행','때문','방향','결론']

def remove_stopwords(word_list, stop_words):
  filtered_words = []
  for word in word_list:
    if word not in stop_words:
      filtered_words.append(word)
  return filtered_words

df['doc_clean'] = df['doc_clean'].apply(lambda x: remove_stopwords(x, stop_words))
```

### LDA 분석

다음은 gensim과 pyLDAvis를 사용해 LDA 분석을 수행하고 시각화한 결과다. 코드는 앞서 언급한 [토픽모델링 최적 갯수 선정](https://blog.naver.com/PostView.naver?blogId=kum2146&logNo=222156272986&parentCategoryNo=&categoryNo=&viewDate=&isShowPopularPosts=false&from=postView) 글과 거의 동일하기 때문에 분석 결과를 중심으로 설명한다. `df['doc_clean']`을 리스트로 담아 하나의 변수에 저장하고, `dictionary`와 `corpus`를 생성한다. `dictionary`에 담긴 토큰의 개수는 4,876개다.

```py
import gensim

all_tokens = df['doc_clean'].tolist()
dictionary = gensim.corpora.Dictionary(all_tokens)
corpus = [dictionary.doc2bow(text) for text in all_tokens]
```

#### 최적의 토픽 개수 찾기

LDA 모델을 학습하기 전에 몇 개의 토픽으로 나눌 것인지 먼저 결정해야 한다. 일반적으로 perplexity와 coherence를 함께 고려해 토픽의 개수를 결정한다.

- perplexity: 모델이 얼마나 잘 예측하는지 나타내는 지표로, 낮은 perplexity 값은 모델이 문서에서 나타나는 단어를 더 잘 예측한다는 것을 의미한다.
- coherence: 발견된 토픽이 얼마나 의미있는지 나타내는 지표로, 높은 coherence 값은 토픽 내 단어들이 서로 관련성이 높다는 것을 의미한다.

토픽의 개수를 2부터 15까지 설정하고, perplexity와 coherence을 측정한 결과다. perplexity는 애매하다고 판단했고, coherence는 토픽의 개수가 6개일 때 가장 높은 결과를 보인다. 최종적으로 토픽의 개수는 6개로 설정했다.

<figure class="flex flex-col items-center justify-center">
    <img src="/python-lda-analysis/perplexity-coherence.png" title="results">    
</figure>

#### LDA 분석 결과

분석 결과는 다음과 같다. 토픽을 6개로 설정했지만, 토픽 사이의 유의미한 구별은 없는 듯 하다. 대부분이 '디지털', '아카이브', '활용', '자료', '구축' 등을 포함하고 있어 토픽을 구분하기 어렵다고 판단했다.

| Topic   | 상위 단어                                                            |
| ------- | -------------------------------------------------------------------- |
| Topic 1 | 아카이브, 문화, 자료, 구축, 지역, 디지털, 활용, 기록, 수집, 보존     |
| Topic 2 | 디지털, 아카이브, 문화, 정보, 활용, 역사, 기술, 콘텐츠, 과정, 사회   |
| Topic 3 | 디지털, 아카이브, 기록, 자료, 역사, 구축, 활용, 지역, 교육, 문화     |
| Topic 4 | 디지털, 아카이브, 정보, 콘텐츠, 기록, 구축, 활용, 기관, 문화, 관리   |
| Topic 5 | 문화, 활용, 자료, 아카이브, 디지털, 콘텐츠, 데이터, 구축, 기록, 정보 |
| Topic 6 | 디지털, 아카이브, 기록, 구축, 자료, 정보, 활용, 콘텐츠, 한국, 데이터 |

#### pyLDAvis로 시각화하기

pyLDAvis는 LDA 수행한 결과를 시각화하는 라이브러리다. Colab에서 사용할 때 추가적으로 다음과 같이 노트북에서 사용가능하도록 설정해줘야 한다.

```py
import pyLDAvis.gensim

pyLDAvis.enable_notebook() # added
vis = pyLDAvis.gensim.prepare(ldamodel, corpus, dictionary, sort_topics=False)
vis
```

시각화한 결과는 다음과 같다. 6개의 분포는 토픽이 분리되어 있는 것을 보이지만... 토픽에 나타나는 단어를 중심으로 살펴보면 크게 차이나는 부분은 없다. λ는 토픽 사이의 거리를 조절하는 파라미터지만, λ가 낮을수록 토픽 내 단어 사이의 응집성이 더 떨어지는 듯하다.

<iframe src="/python-lda-analysis/lda-viz.html" style="height: 900px;" class="w-full"></iframe>

이렇게 최대한 간단하게 LDA 분석하는 방법에 대해 알아봤다. 다른 데이터로도 LDA를 수행한 적이 있지만, 대부분의 분석 결과가 크게 의미있는 것 같지 않다. '디지털 아카이브' 논문이 특정한 토픽으로 나눠지지 않는 게 가장 큰 이유 같다. 이 포스팅의 초점은 유료인 텍스톰으로 벗어나 생성형 AI를 사용하면 파이썬으로 쉽게 자연어처리 분석이 가능하다는 것이다. 파이썬의 초급 학습은 어렵지 않고, 코드의 의미를 읽을수만 있다면 간단한 자연어처리 학습은 쉽게 할 수 있다. 코드를 읽지 못해도 ChatGPT에게 물어보면 코드를 해석해주기 때문에! 텍스톰 보단 파이썬으로 직접 돌려보는 것을 추천한다.
