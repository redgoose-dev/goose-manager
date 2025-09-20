# goose-manager

[goose-api](https://github.com/redgoose-dev/goose-api) 를 관리해주기 위한 서비스이며 [Vue.js](https://vuejs.org/) 프레임워크 환경에서 개발되었습니다.

`goose-manager`를 사용하려면 `goose-api`가 사용하고 있어야 합니다.


## Setup

다음과 같은 과정으로 프로그램 사용을 준비합니다.

- [https://bun.sh](https://bun.sh) 설치
- 프로젝트 클론
- `bun install` 명령어로 의존성 설치
- `.env` -> `.env.local` 파일 복사 및 편집
- 개발 실행하거나 프로덕션 작업


## Development

개발과 빠른 프리뷰 용도로 사용할 수 있습니다.
서버를 실행하려면 다음과 같은 명령어를 실행합니다.

```shell
bun run dev
```

서버가 열리면 `.env`에서 설정한 포트 두개가 같이 열리게 됩니다. 이때 `PORT_CLIENT` 포트를 조합한 URL로 접속합니다. ex) `http://localhost:3030`


## Production

프로젝트를 빌드하고 운영 상태로 서버를 실행합니다.
먼저 다음과 같이 프로젝트를 빌드합니다.

```shell
bun run build
```

빌드가 완료되면 `dist` 디렉토리가 생성됩니다. 이 디렉토리의 내용으로 웹 서버를 실행하기 위하여 다음과 같은 명령어를 실행합니다.

```shell
bun run preview
```

서버가 실행되었으면 `.env`에서 설정한 `PORT` 포트로 접속할 수 있습니다. ex) `http://localhost:3000`


## .env 가이드

프로그램 사용에 기초적인 설정을 합니다.
기본값은 `.env`파일에 기록되어 있으니 참고해주세요.

- `HOST`: 서버 호스트 주소를 설정합니다.
- `PORT`: 백엔드 서버 포트번호 (이 값은 프로덕션 모드에서 사용됩니다.)
- `PORT_CLIENT`: 클라이언트 서버 포트번호 (개발모드에서만 사용됩니다.)
- `DATA_PATH`: 사용자 데이터가 저장되는 경로 이름입니다.
- `URL_PATH`: 이 프로그램에서 사용하는 URL 경로
- `COOKIE_PREFIX`: 쿠키이름 접두사
- `COOKIE_DOMAIN`: 쿠키 도메인
- `COOKIE_HTTPONLY`: 쿠키 HttpOnly 설정
- `COOKIE_PATH`: 쿠키 경로
- `API_URL`: API 서버 URL
- `API_CLIENT_URL`: 클라이언트에서 사용되는 API 서버 URL (값이 없으면 API_URL 값으로 사용합니다.)


## Docker 사용하기

이 프로젝트는 Docker를 지원합니다. Docker를 사용하여 이 프로젝트를 실행하려면 다음 단계를 따르세요.

### 빌드

다음 명령어를 실행하여 이미지를 빌드합니다.

```shell
docker build -t redgoose/goose-manager .
```

### docker-compose.yml 파일

docker-compose를 사용하여 컨테이너를 열 수 있습니다.

```yml
services:
  goose-manager:
    container_name: goose-manager
    image: redgoose/goose-manager:latest
    ports:
      - "8080:3000"
    volumes:
      - ./.env.local:/app/.env.local
      - ./data:/app/data
    networks:
      - my_network

networks:
  my_network:
    name: custom_network
```
