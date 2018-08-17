# goose-manager

[goose-api](https://github.com/redgoose-dev/goose-api) 를 관리해주기 위한 서비스이며 [NUXT](https://nuxtjs.org) 프레임워크 환경에서 개발되었습니다.


## Installation

...


## Usage

### Development

테스트 및 개발을 위한 사용 가이드

```shell
yarn install
yarn run dev
```

Open in browser `http://localhost:3000`


### Production

실서버에서 사용을 위한 가이드

```shell
yarn run build
yarn run start # default host, port

# another port
HOST=0.0.0.0 PORT=7000 yarn run start

# with pm2
cd /home/goose-manager/
HOST=0.0.0.0 PORT=7000 /usr/bin/pm2 start -l 0 npm --name "goose-manager" -- start
```

Open in browser `http://0.0.0.0:7000`


## TODO

- [ ] README / 인스톨