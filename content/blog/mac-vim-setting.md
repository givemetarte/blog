---
title: 맥에서 간단하게 Vim 설정하기 (CursorLine 추가와 colortheme, StatusLine 변경)
description: 별도의 설치 없이 최대한 간단하게 맥에서 Vim을 설정하는 방법에 대해 알아보자. 기본적인 vim 설정과 함께 CursorLine을 추가하고, 텍스트와 StatusLine의 theme를 변경한다.
slug: mac-vim-setting
author: 박하람
category: ETC
datetime: 2024. 08. 26.
language: Korean
featured: None
tags:
  - mac
  - vim
  - vimrc
---

서버에 ssh로 접속해 개발할 때가 많다보니 vim으로 코드를 작성하는 게 일상이다. 이전에 맥에서 vim을 설정할 때 가장 유명한 [이 블로그 글](https://blog.pigno.se/post/184576332493/%EC%99%84%EB%B2%BD%ED%95%9C-mac-%EC%9E%91%EC%97%85%ED%99%98%EA%B2%BD-%EC%84%B8%ED%8C%85%ED%95%98%EA%B8%B0-vim-zsh-iterm)을 보고 환경설정을 했는데, 디자인도 이쁘지 않고 별도로 커스터마이징하고 싶어 vim 설정을 다시 해봤다. 깔 수 있는 모든 플러그인을 깔기보다 비교적 가볍게 vim 설정을 하고 싶었다. 오늘 포스팅은 다음 그림과 같이 내 입맛에 맞게 vim을 간단히 수정한 방법에 대해 알아본다.

![vim theme](/mac-vim-setting/vim-theme.png)

### vimrc 생성하기

기본적으로 vim 설정은 [이 깃헙의 vimrc](https://github.com/amix/vimrc)를 가장 많이 사용하고 있다. 이전에 설정한 vim은 다양한 플러그인과 colortheme가 있는 awesome 버전을 사용했는데, 개인적으로 모르는 기능도 많고 무겁다 느껴져서 새롭게 설정한 버전은 basic 버전이다. 그러나 나는 좀 더 가볍게 설치하기 위해 깃헙에서 코드를 clone하지 않고, 다음과 같이 `.vimrc` 파일을 직접 생성했다. 반드시 `.vimrc` 파일은 `~/.vimrc`에 생성되어야 하는 것에 유의하자.

```bash
vim ~/.vimrc
```

다음은 `.vimrc` 파일에 [basic.vim](https://github.com/amix/vimrc/blob/master/vimrcs/basic.vim)의 내용을 복사 붙여넣기 한다! basic 버전만 해도 `hlsearch`나 `autoread`, 단축키와 같은 기본적인 설정이 추가되어 있어서 awesome 버전은 굳이 필요하지 않다고 생각했다.

### 테마 설정하기

vim 텍스트 테마를 바꿔보자. [vimcolorstheme](https://vimcolorschemes.com/i/trending)를 보면 다양하고 이쁜 컬러테마가 많다. 이 중에서 [awesome vim colorthemes](https://vimcolorschemes.com/rafi/awesome-vim-colorschemes)는 간편하게 테마에 대한 vim 파일을 제공하고 있다. 다음과 같이 폴더를 생성한 다음, `~/.vim/colors` 폴더에 원하는 테마의 vim 파일을 다운로드한다. [awesome vim colorthemes](https://vimcolorschemes.com/rafi/awesome-vim-colorschemes)의 colors 폴더에서 테마의 vim 파일을 제공한다. 내가 선택한 테마는 `jellybeans`다.

```bash
# create folder
mkdir ~/.vim && mkdir ~/.vim/colors
cd ~/.vim/colors
# download colortheme
curl -O https://github.com/rafi/awesome-vim-colorschemes/blob/master/colors/jellybeans.vim
```

`~/.vim/color`에 jellybeans.vim이 다운로드 됐다면, vimrc에서 colorthemes를 찾아 다음과 같이 설정한다. Colors and Fonts 부분에서 `colorscheme`을 찾아 `jellybeans`로 바꿔주면 된다.

```vim
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" => Colors and Fonts
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
...
try
    colorscheme jellybeans
catch
endtry
```

### CursorLine 추가하기

다음으로 추가하고 싶었던 기능은 cursor가 있는 line 표시다. 그냥 cursor가 깜빡거리는 것보다 cursor가 있는 줄의 background 색을 줘서 cursor가 있는 부분을 확실하게 알고 싶었다. 다음과 같이 설정해주면, 아주 연한 gray로 cursor가 있는 줄의 background 색이 설정된다. cursor가 이동하면 cursor가 있는 줄을 알수 있어 시각적으로 꽤나 유용하다.

```vim
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" => VIM user interface
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
...
" highlight cursorline
set cursorline
```

### StatusLine 테마 바꾸기

개인적으로 `vimrc`의 awesome 버전을 쓰면서 StatusLine의 테마를 가장 변경하고 싶었다(누구나 사용하는 획일적인 디자인🥲). jellybeans와 어울리는 Statusline 테마를 찾다가 [이 코드](https://gist.github.com/meskarune/57b613907ebd1df67eb7bdb83c6e6641)를 발견했다. `.vimrc`에 이 코드를 붙여넣으니 보다 이쁘고 다양한 정보를 제공하는 StatusLine을 만들었다.

```vim
 """"""""""""""""""""""""""""""
 " => Status line
 """"""""""""""""""""""""""""""
 " Always show the status line
 set laststatus=2

 " Format the status line
 set statusline=\ %{HasPaste()}%F%m%r%h\ %w\ \ CWD:\ %r%{getcwd()}%h\ \ \ Line:\ %l\ \ Column:\ %c

 " 아래부터 추가
 " status bar colors
 au InsertEnter * hi statusline guifg=black guibg=#d7afff ctermfg=black ctermbg=magenta
 au InsertLeave * hi statusline guifg=black guibg=#8fbfdc ctermfg=black ctermbg=cyan
 hi statusline guifg=black guibg=#8fbfdc ctermfg=black ctermbg=cyan
```
