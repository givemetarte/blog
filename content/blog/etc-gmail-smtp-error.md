---
title: Gmail의 SMTP 기능 활성화하기 (feat. SMTPAuthenticationError)
description: 어플리케이션에서 구글 gmail로 메일이 보내지지 않는 문제가 발생했다. SMTPAuthenticationError를 해결하기 위해 IMAP과 구글 앱 비밀번호를 설정한 방법을 설명한다.
slug: etc-gmail-smtp-error
author: 박하람
category: ETC
datetime: 2024. 05. 02.
language: Korean
featured: None
tags:
  - SMTPAuthenticationError
  - google drive
  - mac
---

관리자 기능이 있는 어플리케이션을 이관하는 과정에서 관리자 계정인 gmail로 이메일이 발송 안되는 문제가 발생했다. 자잘한 에러라 생각했는데, 생각보다 해결하는 데 시간이 꽤 걸렸다. 이 포스팅은 SMTPAuthenticationError를 해결하는 2가지 방법을 소개한다. 전반적인 내용은 [Google - Gmail SMTP 사용을 위한 세팅](https://kincoding.com/entry/Google-Gmail-SMTP-%EC%82%AC%EC%9A%A9%EC%9D%84-%EC%9C%84%ED%95%9C-%EC%84%B8%ED%8C%85) 블로그의 내용을 참고했다.

### 에러 상황

어플리케이션을 이관하는 도중 이런 에러가 발생했다. 관리자 계정은 Gmail인데, 이 계정으로 설정한 SMTP가 원활히 작동하지 않는 상황이었다.

<figure class="flex flex-col items-center justify-center">
    <img src="/etc-gmail-smtp-error/smtp-error.png" title="stmp error">    
</figure>

### Gmail의 IMAP 설정

첫번째로 수행한 것은 Gmail의 IMAP을 설정한 것이다. 앞서 소개한 블로그에서 IMAP 설정에 대해 자세하게 안내하고 있다. Gmail의 설정해서 다음과 같이 enable IMAP을 설정한다.

<figure class="flex flex-col items-center justify-center">
    <img src="/etc-gmail-smtp-error/imap-setting.png" title="IMAP setting">    
</figure>

### 구글 앱 비밀번호 설정

두번째로 수행한 것은 구글 앱 비밀번호를 설정한 것이다. 간단해 보였지만, 생각보다 구글 앱 비밀번호를 설정하는 곳을 찾기 어려웠다. 다양한 블로그를 봤는데, 현재 버전으로 업데이트 되지 않은 글이 많아서 현재(2024년 5월) 기준으로 설정하는 방법은 다음과 같다.

- `구글 > 계정 > 보안`으로 접속한다 ([블로그 글 ](https://kincoding.com/entry/Google-Gmail-SMTP-%EC%82%AC%EC%9A%A9%EC%9D%84-%EC%9C%84%ED%95%9C-%EC%84%B8%ED%8C%85) 참고)
- 검색으로 '앱 비밀번호'(한글) 또는 'app passwords'를 입력한 다음 'App passwords'를 클릭한다.
- 앱 비밀번호를 할당할 어플리케이션의 이름을 입력하고, 16자리 앱 비밀번호를 받는다

간단해 보이지만, 애를 먹은 부분은 '앱 비밀번호'를 찾는 것이다. 어떤 블로그 글은 2단계 인증을 하면 앱 비밀번호를 찾을 수 없다고 설명해놨다🥲 앞서 참고한 블로그 글은 2단계 인증을 클릭하면 아래에 '앱 비밀번호'가 뜬다고 설명했다. 구글의 안내를 찾아보니 다음과 같은 이유로 2단계 인증 후에 앱 비밀번호를 설정하는 게 뜨지 않을 수 있다고 설명했다. (2단계 인증을 해제해야 앱 비밀번호를 설정할 수 있다는 것은 거짓..!)

<figure class="flex flex-col items-center justify-center">
    <img src="/etc-gmail-smtp-error/app-password-setting.png" title="app passord setting">    
</figure>

그래서 찾은 방법이 검색하기(thx to. 솜솜) !!!!! 나처럼 2단계 인증 후 앱 비밀번호가 나오지 않는다면 검색 후 찾으면 된다..ㅎㅎ 어플리케이션에 SMTP 비밀번호를 Gmail의 앱 비밀번호로 설정해줬더니 드디어 Gmail로 이메일이 잘 전송됐다!
