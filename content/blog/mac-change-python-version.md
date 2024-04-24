---
title: 맥에서 homebrew로 파이썬 버전 변경하고, VSC에서 변경한 파이썬 버전으로 인터프리터 바꾸기
description: homebrew로 간단히 파이썬 버전을 변경하고, VSC에서 변경된 파이썬 버전으로 쥬피터 노트북을 실행해보자.
slug: mac-change-python-version
author: 박하람
category: ETC
datetime: 2024. 04. 24.
language: Korean
featured: None
tags:
  - homebrew
  - python version
  - ipykernel
  - VSC
---

VSC에서 파이썬 3.9 버전으로 작업하다가 버전을 업그레이드해야 할 일이 생겼다. 파이썬 버전 3.12로 업데이트 하면서 VSC에서 파이썬 3.12 버전으로 인터프리터를 바꾸고 싶었는데, 생각보단 빠르게 되지 않았다. 중간에 오류사항이 생겼는데, 오늘 포스팅은 파이썬 버전을 변경하면서 오류를 해결한 방법을 공유해본다.

### 파이썬 버전 변경

파이썬 버전 변경에 대한 전반적인 방법은 [이 블로그 글](https://velog.io/@kyliecamila_/homebrew-python-version%EB%B3%80%EA%B2%BD)을 참고했다. 다음의 코드와 같이 실행하면 정상적으로 파이썬 3.12로 버전이 변경된다. 본인은 파이썬 3.12가 설치되어 있었기 때문에 따로 버전을 설치하지 않았다. 원하는 파이썬 버전이 설치되지 않았다면, `brew install python@3.12`로 설치한다.

```bash
# 현재 설치된 파이썬 경로 파악하기
which python3

# 원하는 파이썬 버전이 있는지 확인하기 (3.12)
ls -l /opt/homebrew/bin/python*

# python 실행 시 3.12로 연결하는 심볼릭 링크 생성하기
ln -s -f /opt/homebrew/bin/python3.12 /opt/homebrew/bin/python

# 파이썬 버전이 변경됐는지 확인하기
python --version
```

### zshrc에 저장된 경로 삭제하기

기존에 파이썬 버전 3.9로 작동할 때, 파이썬을 실행할 기본경로를 zshrc에 설정해줬다. 새로운 버전으로 파이썬이 실행될 수 있도록 바꾸었기 때문에, 다음과 같이 3.9로 설정한 경로를 삭제하자. zshrc에서 수정한 후에 source로 저장하는 것을 잊지 말자.

```bash
vim ~/.zshrc

# export PYTHON_PATH=/opt/homebrew/opt/python@3.9/bin/python3.9
# export PATH=$PYTHON_PATH:$PATH

source ~/.zshrc
```

### VSC에서 인터프리터 변경하기

VSC에서 kernel을 파이썬 3.12 버전으로 수정해줬지만, `ikernel`이 없어서 계속 설치하라는 창만 떴다. 코드를 실행하면 다음과 같은 코드를 터미널에서 실행하라고 했지만 에러가 떴다. 아래 코드의 의미를 해석해보면 내가 파이썬을 homebrew로 설치했기 때문에 시스템 전체에 패키지를 설치하려면 `brew install`을 사용해야 한다는 것이다.

```bash
$ /opt/homebrew/bin/python3.12 -m pip install ipykernel -U --user --force-reinstall

error: externally-managed-environment

× This environment is externally managed
╰─> To install Python packages system-wide, try brew install
    xyz, where xyz is the package you are trying to
    install.

    If you wish to install a non-brew-packaged Python package,
    create a virtual environment using python3 -m venv path/to/venv.
    Then use path/to/venv/bin/python and path/to/venv/bin/pip.

    If you wish to install a non-brew packaged Python application,
    it may be easiest to use pipx install xyz, which will manage a
    virtual environment for you. Make sure you have pipx installed.

note: If you believe this is a mistake, please contact your Python installation or OS distribution provider. You can override this, at the risk of breaking your Python installation or OS, by passing --break-system-packages.
hint: See PEP 668 for the detailed specification.
```

homebrew로 ikernel 설치는 할 수 없다. 해결하는 간단한 방법은 파이썬 3.12를 기반으로 가상환경 kernel을 생성해주면 된다. 아래 그림에서 'Create Python Environment'를 클릭해주고, venv나 conda를 선택해 3.12 버전으로 가상환경을 생성한다. 이 가상환경 안에서는 `pip install`을 실행할 수 있고, ikernel이 무사히 설치된다.

<figure class="flex flex-col items-center justify-center">
    <img src="/mac-change-python-version/vsc.png" title="python 인터프리터 변경하기">    
</figure>

---

VSC에서 파이썬 인터프리터를 버전에 맞게 변경하는게 은근히 귀찮아서 안하고 있다가... 버전을 바꿔야 하는 일 때문에 수정했다. 이제 파이썬 인터프리터를 수정하는 방법을 제대로 알았으니 kernel 좀 그만 만들어야겠다.
