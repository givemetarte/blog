---
title: Git Large File Storage를 사용해 50MB 이상의 파일 업로드하기
description:
slug: git-lfs-setting
author: 박하람
category: Knowledge Graph
datetime: 2024. 03. 20.
language: Korean
featured: None
tags:
  - blazegraph
  - bulk data
  - fastload.properties
---

```bash
brew install git-lfs
```

```bash
git lfs install
git lfs install --system
# Git LFS initialized.
```

- 현재 사용자만 Git LFS를 사용할 수 있도록 설치 (다른 사용자는 별도로 설치해야 함)
- 시스템 전체에 Git LFS를 설치, 모든 사용자가 기본적으로 Git LFS를 사용할 수 있게 됨. 이때 root 경로에서 해당 코드를 실행해야 함

```
git rm --cached (file path)
```

```
git lfs track "*.zip"
git add .gitattributes
git lfs untrack "*.zip"
```

참고: https://velog.io/@shin6949/Git-LFS-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
