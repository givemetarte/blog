---
title: 우분투에서 Discourse 이관하기 (nginx 설정과 discourse 백업 적용)
description: 우분투 서버에 기존에 운영하고 있던 discourse를 이관하는 작업을 설명한다. 이 과정에서 discourse 외부에 nginx를 설치하는 방법과 command line으로 백업을 적용하는 방법에 대해 설명한다.
slug: ubuntu-discourse-transfer
author: 박하람
category: Linux&Docker
datetime: 2024. 05. 03.
language: Korean
featured: None
tags:
  - dddd
---

Discourse는 커뮤니티의 소통을 위한 오픈소스 플랫폼으로, [깃헙](https://github.com/discourse/discourse)에 모든 소스코드가 공개되어 있다. 주어진 과제는 기존의 서버에서 돌아가는 discourse를 새로운 우분투 서버로 이관하는 것이었다. 기록을 위해 이관 과정을 차례로 설명한다.

### 백업 파일 다운로드

discourse는 백업 파일을 다운로드 받을 수 있다. 관리자 계정으로 들어가 사이트설정 > 백업 > allow restore 조건을 허용한다. 이 조건은 모든 사이트 데이터를 대체할 수 있는 복원을 허용하게 해주는 것이다. 그 이후 다음과 같이 `tar.gz`로 백업 데이터를 다운로드 받을 수 있다.

<figure class="flex flex-col items-center justify-center">
    <img src="/ubuntu-discourse-transfer/backup-downalod.png" title="backup download">    
</figure>

백업 파일 다운로드는 관리자 계정에 설정한 이메일로 전송된다. 그러나, stmp 기능이 작동하지 않는 관계로 직접 백업 파일이 저장된 경로를 찾아 백업파일을 이전해놨다. 백업파일이 있는 경로는 다음과 같다.

```
/var/discourse/shared/standalone/backups/default
```

### nginx 설정하기

새로운 서버는 nginx가 이미 운영중인 상태였기 때문에 discouse 내부에 있는 nginx는 사용하지 않는다. discourse는 설치파일을 실행하기 전에 도메인을 부여하는 게 필요하다. 즉, localhost를 실행할 수 없기 때문에... 미리 부여받은 도메인이 필요하다.

`test.domain.com`으로 discourse를 실행하려면, nginx의 sites-available 폴더에서 `test.domain.com`이란 제목의 파일을 만든 후 다음과 같이 작성한다.

```nginx
# /etc/nginx/sites-available/test.domain.com

server {
  server_name test.domain.com;
  location / {
    location / {
        # First attempt to serve request as file, then
        # as directory, then fall back to displaying a 404.
        # try_files $uri $uri/ =404; proxy_pass
        proxy_pass http://unix:/var/discourse/shared/standalone/nginx.http.sock:;
        proxy_set_header Host $http_host;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
    }
  }
}
```

이후 symlink를 설정해주고, certbot을 활용해 https 인증을 받는다. certbot 인증에 대한 자세한 설명은 [이 블로그 글](https://velog.io/@pinot/Ubuntu-Nginx-%ED%99%98%EA%B2%BD%EC%97%90%EC%84%9C-CertBot%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-https-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)을 확인하자. 이전에 동일한 도메인으로 certificate를 받아놓은 경우는 이전 서버에서 인증을 삭제해야 한다.

```bash
# symlink 설정
sudo ln -s /etc/nginx/sites-available/test.domain.com /etc/nginx/sites-enabled/test.domain.com

# 서버 리로드
sudo service nginx reload

# certbot 설치 후 실행
sudo certbot --nginx -d test.domain.com
```

### 서버에 discourse 세팅하기

nginx 설정까지 완료됐다면 이제 새로운 서버에 discourse를 세팅해보자. discourse를 실행하기 위해 최소한 남는 스토리지가 5G 정도 되어야 한다. (서버 스토리지가 5G도 남지 않아 설치 에러가 떴다..🥲) discourse를 설치하는 방법은 다음과 같다. 원하는 경로에 discourse 레포지토리를 클론한 다음, 다음과 같이 설치 파일을 실행한다. 설치파일을 실행할 때 discourse_docker 경로에서 수행해야 한다.

```bash
git clone https://github.com/discourse/discourse_docker.git
cd discourse_docker

# 설치 파일 실행
./discourse-setup
```

다음과 같이 실행하고 정상적으로 완료됐다면 서버 설치는 완료됐다. 그러나, `test.domain.com`에서 discourse가 정상적으로 뜨지 않을 것이다. nginx를 외부에서 사용한다면 설정을 바꿔주어야 한다.

```bash
# discourse 종료
./launcher stop app

# discourse/discourse_docker/containers로 이동
vim app.yml
```

이 파일은 discourse의 설정을 담아놨다. 여기에서 다음의 내용으로 수정하자. 주의해야 할 내용은 SMTP로 보낼 이메일 계정을 설정하는 것이다. 관리자 인증은 메일을 통해 인증하는데, 여기서 SMTP를 설정한다. gmail을 사용할 경우, 앱 비밀번호를 발급받은 후에 `DISCOURSE_SMTP_PASSWORD`에 입력한다. 앱 비밀번호를 설정하는 방법은 [이전 블로그 글](/blog/etc-gmail-smtp-error)에서 설명하고 있다.

```yml
templates:
  - "templates/postgres.template.yml"
  - "templates/redis.template.yml"
  - "templates/sshd.template.yml" # added
  - "templates/web.template.yml"
  - "templates/web.ratelimited.template.yml"
  ## Uncomment these two lines if you wish to add Lets Encrypt (https)
  #  - "templates/web.ssl.template.yml" # removed
  #  - "templates/web.letsencrypt.ssl.template.yml" # removed
  - "templates/web.socketed.template.yml" # added
  ...
DISCOURSE_HOSTNAME: test.domain.com
DISCOURSE_DEVELOPER_EMAILS: test.park@gmail.com
DISCOURSE_SMTP_ADDRESS: smtp.gmail.com
DISCOURSE_SMTP_PORT: 587
DISCOURSE_SMTP_USER_NAME: test.park@gmail.com
DISCOURSE_SMTP_PASSWORD: "앱 비밀번호 16자리"
#DISCOURSE_SMTP_ENABLE_START_TLS: true           # (optional, default true)
DISCOURSE_SMTP_DOMAIN: gmail.com
DISCOURSE_NOTIFICATION_EMAIL: test.park@gmail.com
```

위에서 설정을 수정했다면, 다시 discourse를 rebuild 해야 한다. 다음과 같이 코드를 실행하면, 드디어 `test.domain.com`에서 디스코드를 볼 수 있다.

```bash
# discourse/discourse_docker가 있는 경로로 이동
./launcher rebuild app

# nginx reload
sudo service nginx reload
```

### 백업파일 적용하기

초기 상태의 discourse는 백업 파일을 적용하면, 이전과 같은 데이터를 가져올 수 있다. 백업 파일을 다운로드 받은 곳에 들어가 업로드를 누른 후, 백업 파일을 업로드하면 되지만... 중간에 팝업으로 Sorry하면서 정상작동하지 않았다. 이 경우는 command line으로 직접 백업파일을 실행해야 한다. discourse 커뮤니티에서 안내한 방법은 [Restore a backup from the command line](https://meta.discourse.org/t/restore-a-backup-from-the-command-line/108034)에서 확인할 수 있다.

```bash
# 다음의 경로로 백업 파일 이동하기
mv sitename-2024-05-03-042252-v20190130013015.tar.gz /var/discourse/shared/standalone/backups/default

# 다음의 경로로 이동 후 도커 컨테이너 진입
cd /discourse/discourse_docker
./launcher enter app

# enable_restore 허용
discourse enable_restore

# 백업파일 실행 (백업파일의 이름과 동일해야 함)
restore sitename-2024-05-03-042252-v20190130013015.tar.gz

# 도커 컨테이너 exit
exit

# discourse rebuild
cd /discourse/discourse_docker
./launcher rebuild app
```

여기까지 정상적으로 수행했다면 `test.domain.com`에서 백업 완료된 discourse가 나올 것이다🎉 여기까지 과정에서 가장 애를 많이 먹은 부분은 gmail의 STMP 설정이었다...! 이것저것 시행착오는 겪었지만 discourse 커뮤니티가 활발해서 무사히 이관을 마칠 수 있었다😋
