# icon component

컴포넌트 형식으로 이루어진 svg 아이콘입니다.


## Convert icon svg to vue

svg 파일을 vue 파일로 바꿔주는 스크립트입니다.
변환작업이 좀 많은편이라서 파이썬으로 스크립트를 작성하게 되었습니다.

먼저 `./src` 경로속에 `svg`파일들을 집어넣습니다.
그리고 다음과 같이 스크립트를 실행하면 `svg` 파일들은 `vue`파일로 변환되고, `./src/index.json`파일이 만들어집니다.

```
python3 convert-icon-src.py
```

`index.json` 파일은 아이콘 이름의 목록입니다.


## Add id on SVG files

`svg`파일에서 id 속성값을 추가해주는 스크립트입니다.
