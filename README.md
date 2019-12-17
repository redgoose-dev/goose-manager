# goose-manager

[goose-api](https://github.com/redgoose-dev/goose-api) 를 관리해주기 위한 서비스이며 [NUXT](https://nuxtjs.org) 프레임워크 환경에서 개발되었습니다.

`goose-manager`를 사용하려면 `goose-api`가 사용하고 있어야 합니다.


## Setup

저장소를 복제하면 루트에 `.env.example` 파일을 찾을 수 있습니다. 이것을 `.env`파일로 복사해주세요.

```bash
$ cp .env.example .env
```

에디터를 열어 다음 항목들을 참고하면서 수정해주세요.

- `APP_NAME`: App name
- `APP_URL`: Manager url
- `APP_API_URL`: API url
- `APP_SECRET_KEY`: secret key (영문, 숫자, 특수문자를 섞어서 랜덤값을 만드세요.)
- `TOKEN_PUBLIC`: API에서 사용하는 공개토큰. 자세한건 [goose-api install guide](https://github.com/redgoose-dev/goose-api/wiki/Install-guide)페이지를 참고해주세요.
- `DB_HOST`: session db host
- `DB_PORT`: session db port
- `DB_DATABASE`: session db name
- `DB_USERNAME`: session db user name
- `DB_PASSWORD`: session db user password


## Usage

### Development

테스트 및 개발을 위한 사용 가이드

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
$ yarn run start # default host, port
```

#### change host and port

```bash
$ HOST=0.0.0.0 PORT=7000 yarn run start
```

#### With [PM2](http://pm2.keymetrics.io)

```bash
$ cd /home/goose-manager
$ HOST=0.0.0.0 PORT=7000 /usr/bin/pm2 start -l 0 npm --name "goose-manager" -- start
```

open in browser `http://0.0.0.0:7000`
