---
title: 문자열 유사성을 측정하는 String Metric 알고리즘 (Levenshtein, Damerau-Levenshtein, Longest common subsequence, Hamming, Jaro-Winkler)
description: 문자열의 유사성을 측정하는 String distance 알고리즘에 대해 알아보자. 가장 광범위하게 사용되는 Levenshtein distance를 포함한 5가지의 알고리즘을 정리한다.
slug: nlp-string-distance
author: 박하람
category: NLP/LLM
datetime: 2024. 02. 02.
language: Korean
featured: None
tags:
  - Levenshtein distance
  - Damerau-Levenshtein distance
  - Longest common subsequence
  - Hamming distance
  - Jaro-Winkler distance
---

데이터세트에서 추출한 컬럼명의 유사성을 어떻게 측정할 수 있는 것일까? 태스크는 약 9만 개의 컬럼명 중에서 특정한 컬럼명 집합과 유사한 컬럼명을 추출하는 것이다. `Word2Vec`과 같은 임베딩 방법은 충분한 맥락이 존재하는 데이터가 있어야 가능한데, 단순한 문자열의 나열인 컬럼명은 임베딩으로 단어 사이의 유사성을 측정하기 어려웠다. 거의 3달째 내 골머리를 앓고 있던 주제였는데, string metric에서 해답을 찾은 것 같다. 오늘 포스팅은 아래 참고문헌을 광범위하게 참고하고 있다.

## String metric

String metric은 두 텍스트 문자열(string) 사이의 거리를 측정하는 방법이다. String similarity metric 또는 string distance function이라 불리기도 한다. 예를 들어, '가나다라마'와 '다라마바사'는 형태적으로 비슷하기 때문에 가까운 거리를 갖고 있는 것으로 해석한다. 이 때 거리를 측정하는 대표적인 Metric으로 `Levenshtein distance`, `Damerau-Levenshtein distance`, `Longest common subsequence`, `Hamming distance`, `Jaro-Winkler distance`가 있다.

### Levenshtein distance

`Levenshtein distance`는 string metric 중 가장 광범위하게 활용되고 있다. 편집 거리(edit distance)라고 불리기도 한다. Levenshtein 거리는 두 문자열 사이의 유사성을 비교하는데, 하나의 입력 문자열을 다른 입력 문자열로 변환하는 데 필요한 삽입(insertion), 삭제(deletion), 대체(substition)의 최소 횟수를 계산한다. 예를 들어, 'kitten'과 'sitting'의 Levenshtein 거리를 구한다고 생각해보자.

- <u>**k**</u>itten → <u>**s**</u>itten ("k"를 "s"로 대체)
- sitt<u>**e**</u>n → sitt<u>**i**</u>n ("e"를 "i"로 대체)
- sittin → sittin<u>**g**</u> (끝에 "g" 삽입)

위의 경로대로 계산하면, Levenshtein 거리의 값은 3이다. Levenshtein 거리를 계산하는 구체적인 방법은 [Levenshtein (edit) distance를 이용한 한국어 단어의 형태적 유사성](https://lovit.github.io/nlp/2018/08/28/levenshtein_hangle/) 글에서 잘 설명한다. 이 글은 Levenshtein 거리를 파이썬으로 구현하는 파이썬 코드와 함께 한국어의 초/중/종성을 반영한 Levenshtein 거리를 구현한다. soynlp는 Levenshtein 거리를 계산하는 함수와 함께 초/중/종성을 고려한 Levenshtein의 거리를 계산하는 함수를 제공한다[^1].

### Damerau-Levenshtein distance

`Damerau-Levenshtein distance`는 Levenshtein distance에 전치(transposition)을 추가한 metric이다. 즉, 첫번째 문자열에서 다른 문자열로 변환할 때 요구되는 개별 character 사이의 삽입과 삭제, 대체 연산과 함께 전치의 최수 횟수를 구한다. 전치는 인접한 문자열의 뒤바꿈(예: 'red' → 'erd')을 의미한다.이 메트릭을 개발한 Damerau는 spelling error의 80% 이상이 4가지(삽입과 삭제, 대체, 전치)로 분류할 수 있다고 설명한다(Damerou, 1964). Damerau-Levenshtein 거리는 기존 Levenshtein 거리에 전치를 추가함으로써 문자열의 더 넓은 오류 또는 변형을 처리할 수 있다. 구현에 대한 자세한 내용은 [위키피디어의 Damerau-Levenshtein distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance)에서 설명하고 있다.

### Longest common subsequence

Longest common subsequence는 최종 공통 부분수열이라고 한다. 이 metric은 두 문자열 중 가장 긴 부분의 문자열을 찾는다. 예를 들어, 'A<u>**BCD**</u>E<u>**F**</u>'와 'G<u>**BCDF**</u>'가 있을 때 최종 공통 부분수열은 '<u>**BDCF**</u>'가 된다. 즉, 꼭 붙어있지 않아도 문자 사이를 건너뛰어 공통된다면 공통 부분수열이 된다. (여기서 Longest common substring은 공통된 문자열만 해당하는 것으로, 'BCD'만 공통 문자열에 해당한다.) 상세한 설명은 [[알고리즘] 그림으로 알아보는 LCS 알고리즘 - Longest Common Substring와 Longest Common Subsequence](https://velog.io/@emplam27/%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-%EA%B7%B8%EB%A6%BC%EC%9C%BC%EB%A1%9C-%EC%95%8C%EC%95%84%EB%B3%B4%EB%8A%94-LCS-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-Longest-Common-Substring%EC%99%80-Longest-Common-Subsequence)를 참고하면 된다. Longest common subsequence는 최장의 공통 부분수열을 찾으므로, 대체와 전치는 제외하고 삽입과 삭제만 반영한다.

### Hamming distance

`Hamming distance`는 동일한 길이로 구성된 2가지의 문자열에 대해 character가 다른 개수를 측정한다. 즉, 한 문자열을 다른 문자열로 변경하는 데 필요한 대체의 최소 횟수를 구한다. 예를 들어, "ka<u>**rol**</u>in"과 "k<u>**athr**</u>in"은 Hamming 거리가 3이다. 다른 metric에 비해 간단하기 때문에 다음과 같이 파이썬으로 쉽게 구현할 수 있다.

```py
def hamming_distance(string1: str, string2: str) -> int:
    """Return the Hamming distance between two strings."""
    if len(string1) != len(string2):
        raise ValueError("Strings must be of equal length.")
    dist_counter = 0
    for n in range(len(string1)):
        if string1[n] != string2[n]:
            dist_counter += 1
    return dist_counter
```

- Hamming 거리는 두 문자열의 길이가 같을 때만 사용할 수 있다. `if`절은 두 문자열의 길이가 같은지 확인한다.
- `dist_counter`는 2개의 문자열에 대해서 동일한 위치에 character가 다른 횟수다.
- `for`문은 문자열의 위치마다 서로 다른 character가 있는 경우에 `dist_counter`의 횟수를 1씩 늘린다.

### Jaro-Winkler distance

`Jaro-Winkler distance`는 접두사(prefix)를 사용해 문자열의 유사성을 측정한다. 두 문자열의 앞글자(= 접두어)가 동일하다면 두 문자열이 유사할 가능성이 높다는 가정에 기반한다. '<u>**ad**</u>minstration'과 '<u>**ad**</u>vertiser'라는 단어가 있다면, 접두어를 2로 지정할 때 이 접두어가 동일한 문자열('<u>**ad**</u>')에 더 유리한 점수를 부여한다. Jaro-Winkler 거리는 (1) Jaro similarity를 계산한 다음, (2) 접두어를 고려한 Jaro-Winkler similarity를 측정한다. 거리의 값은 0과 1사이 의 값으로 정규화된다.

Jaro similarity는 다음과 같이 계산한다. 두 개의 문자열이 $s_1$, $s_2$라고 할 때, $\left| s_i \right|$는 문자열의 길이다. $m$는 일치하는 character의 수이고, $t$는 character가 전치된 횟수다. 이 점수는 문자열이 전혀 일치하지 않으면 0이고, 정확히 일치하면 1이다.

$$
sim_j = \begin{cases} 0, & \text{if }m = 0 \\
\frac{1}{3} \left( \frac{m}{\left| s_1 \right|} + \frac{m}{\left| s_2 \right|} + \frac{m-t}{m} \right), & \text{otherwise} \end{cases}
$$

Jaro-Winkler similarity의 계산 방법은 다음과 같다. 여기서 접두어에 대한 가중치를 부여한다. $l$는 공통된 접두어의 문자열 개수로, 최대 4개까지 설정한다. $p$는 동일한 접두어를 갖고 있는 문자열에 대해 가중치를 부여한다. $p$는 0.25를 초과하면 안된다(접두어의 길이가 최대 4개이기 때문에 0.25를 넘으면 1보다 커질 수 있다). 일반적으로 $p = 0.1$을 사용한다.

$$
sim_w = sim_j + lp(1-sim_j)
$$

Jaro-Winkler distance는 대표적으로 [JaroWinkler](https://github.com/rapidfuzz/JaroWinkler)라는 파이썬 라이브러리를 활용할 수 있다.

### 정리

문자열의 유사도를 측정하는 대표적인 알고리즘에 대해 간단하게 정리해봤다. 삽입과 삭제, 대체, 전치의 기준에서 개별 알고리즘을 정리한 결과는 다음과 같다.

|             목록             | 삽입(insertion) | 삭제(deletion) | 대체(substitution) | 전치(transportation) |
| :--------------------------: | :-------------: | :------------: | :----------------: | :------------------: |
|     Levenshtein distance     |        O        |       O        |         O          |          X           |
| Damerau-Levenshtein distance |        O        |       O        |         O          |          O           |
|  Longest common subsequence  |        O        |       O        |         X          |          X           |
|       Hamming distance       |        X        |       X        |         O          |          X           |
|    Jaro-Winkler distance     |        X        |       X        |         X          |          O           |

위의 표를 기준으로 내 태스크를 다시 살펴보면, 약 9만 개의 컬럼명 중에서 특정 주제(예: 도로명주소)의 컬럼명과 형식적으로 유사한 컬럼명을 추출하는 것이 목표다. 이 태스크에 대한 특징은 다음과 같다:

- **짧은 문자열의 길이**: 약 9만 개의 컬럼명 길이는 0부터 30까지에 많이 분포되어 있다. Levenshtein 또는 Damerau-Levenshtein은 기존 문자열에서 바뀔 문자열로 가는 편집 거리를 계산하기 때문에, 긴 문자열에 유리하다. 반면, Jaro-Winkler는 접두어를 사용해 작은 단어나 어구(예: 이름, 주소)의 비교에 용이하도록 개발되었기 때문에, 컬럼명과 같은 짧은 문자열의 유사성 계산에 더 유리하다.
- **명사 중심의 단어 결합**: 컬럼명은 '행사^내용', '행사^시작^일자', '행사^종료^일자'과 같이 명사 중심으로 결합되어 있다. '밥을 먹는 사람'과 '사람이 밥을 먹는다'와 같은 문자열의 유사성은 어근 또는 어미 등을 고려해야 한다. 즉, 한국어의 초/중/종성을 고려해 알고리즘을 변형해야 한다. 그러나, 컬럼명은 일반적으로 단어의 나열로 구성된다.
- **전치 중심의 컬럼명 유사성**: 동일한 의미의 컬럼명은 대체적으로 위치를 바꾼 단어의 조합이다. 예를 들어, '도로명주소'와 유사한 컬럼명은 '영문도로명주소', '주소(도로명)', '소재지도로명'과 같이 단어의 전치가 두드러진다.

종합적으로 이 태스크에 적절한 알고리즘은 `Jaro-Winkler distance`라고 생각한다. 우선 `Hamming distance`는 동일한 길이를 가진 문자열만 유사성을 계산할 수 있기 때문에 제외한다. `Longest common sequence`는 유사한 컬럼명은 전치 형태가 많기 때문에 삽입과 삭제에 특화된 LCS는 제외한다. `Levenshtein`와 `Damerau-Levenshtein`은 다방면에서 편집 거리를 계산할 수 있지만, 긴 텍스트에 비교적 최적화되어 있다. 특히, 컬럼명은 초/중/종성의 변화가 크지 않기 때문에 굳이 초/중/종성을 고려한 Levestein 방식을 고려할 필요는 없다. 결론적으로 `Jaro-Winkler distance`가 짧은 길이와 전치에 특화되어 있어 컬럼명의 유사도를 찾는데 가장 적합한 알고리즘이라고 생각한다.

### 참고문헌

- String metric, Wikipedia. Available: https://en.wikipedia.org/wiki/String_metric
- Levenshtein distance, Wikipedia. Available: https://en.wikipedia.org/wiki/Levenshtein_distance
- Damerau-Levenshtein distance, Wikipedia. Available: https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance
- Levenshtein (edit) distance를 이용한 한국어 단어의 형태적 유사성, LOVIT x DATA SCIENCE. Available: https://lovit.github.io/nlp/2018/08/28/levenshtein_hangle/
- [알고리즘] 그림으로 알아보는 LCS 알고리즘 - Longest Common Substring와 Longest Common Subsequence, empla27.log. Available: [link](https://velog.io/@emplam27/%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-%EA%B7%B8%EB%A6%BC%EC%9C%BC%EB%A1%9C-%EC%95%8C%EC%95%84%EB%B3%B4%EB%8A%94-LCS-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-Longest-Common-Substring%EC%99%80-Longest-Common-Subsequence)
- Damerau, F. J. (1964). A technique for computer detection and correction of spelling errors. Communications of the ACM, 7(3), 171–176. https://doi.org/10.1145/363958.363994

[^1]: https://github.com/lovit/soy/blob/master/soy/nlp/hangle/_distance.py
