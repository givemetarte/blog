---
title: Mac의 터미널에서 Google Drive를 사용하기 (feat. symlink)
description: 맥의 터미널에서 구글 드라이브를 원하는 경로에서 사용하려면 symlink를 설정해주는 것이 편하다. 간단하게 symlink를 설정해주는 방법에 대해 알아보자.
slug: etc-mac-symlink
author: 박하람
category: ETC
datetime: 2024. 02. 27.
language: Korean
featured: None
tags:
  - symlink
  - google drive
  - mac
---

현재 아이클라우드에 있는 문서를 모두 구글 드라이브로 옮기는 작업을 하고 있다. 이 과정에서 한번에 터미널로 데이터를 옮기려고 하다보니, 터미널에서 구글 드라이브에 쉽게 접속할 수 있는 경로를 설정하는 것이 좋겠다고 판단했다. 내 경우는 구글 드라이브의 경로가 Desktop에 위치했으면 좋겠어서 다음과 같이 symlink를 만들어줬다.

### Google Drive의 위치 파악하기

구글 드라이브의 위치는 다음과 같다. `{}`로 표시한 부분은 본인의 것으로 바꾸면 된다.

```
/Users/{user}/Library/CloudStorage/GoogleDrive-{email}/My Drive
```

### symlink 설정하기

symlink 설정은 간단하다. 다음과 같이 왼쪽은 실제 경로를 작성해주고, 오른쪽은 symlink로 부여될 경로를 작성해준다. 이 코드는 Desktop에서 My Drive란 이름으로 symlink가 생성된다.

```bash
ln -s /Users/{user}/Library/CloudStorage/GoogleDrive-{email}/My\ Drive
 /Users/{user}/Desktop/My\ Drive
```

이렇게 해주면 터미널에서 로컬에 있는 파일을 google drive로 옮길 수 있다!
