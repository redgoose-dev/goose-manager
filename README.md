# goose-manager

[goose-api](https://github.com/redgoose-dev/goose-api) 를 관리해주기 위한 서비스이며 [Vue.js](https://vuejs.org/) 프레임워크 환경에서 개발되었습니다.

`goose-manager`를 사용하려면 `goose-api`가 사용하고 있어야 합니다.


## Setup

다음 명령어들을 실행하여 `.env`파일을 복제해 줍니다.

```bash
$ cp .env .env.local
```

[.env guide](https://github.com/redgoose-dev/goose-manager/wiki/.env-guide) 문서를 참고하여 편집합니다.


## Usage

### Development

테스트 및 개발을 위한 사용

```bash
$ yarn install
$ yarn run dev
```

Open in browser `http://localhost:3000`

### Production

다음은 실서버에서 사용을 위한 가이드입니다.

#### build and start server

```bash
$ yarn run build
$ yarn run start
```

#### change host and port

```bash
$ HOST=0.0.0.0 PORT=3000 yarn run start
```

아니면 `.env.local`파일에서 `VITE_HOST`, `VITE_PORT` 항목에서 값을 고쳐서 사용해도 됩니다.

#### With [PM2](http://pm2.keymetrics.io)

```bash
$ cd /goose-manager
$ /usr/bin/pm2 start -l 0 npm --name "goose-manager" -- start
```

open in browser `http://0.0.0.0:3000`
