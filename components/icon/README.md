# icon component

컴포넌트 형식으로 이루어진 svg 아이콘입니다.

## icon set

[Feather](https://feathericons.com)


## Edit svg files script

svg 파일들을 새로 교체하면 한번 실행해줘야하는 스크립트입니다.
이 작업은 이 컴포넌트에서 사용할 수 있도록 `id`속성을 집어넣는데 목적을 두고 있습니다.

변환작업이 좀 많은편이라서 파이썬으로 스크립트를 작성하게 되었습니다.

### Usage

먼저 `./static/icons` 경로속에 `svg` 파일들을 집어넣습니다. 그리고 다음과 같이 스크립트를 실행합니다.

```
cd ./scripts
python3 edit-svg-files.py
```

`svg` 파일들의 내용이 일괄적으로 변경되고, `./components/icon/svg-index.json`파일이 만들어집니다.
`svg-index.json` 파일은 아이콘 이름의 목록입니다.


> 만약 `icon set`이 변경되어서 아이콘이 전부 바뀐다면 파이썬 스크립트도 조금 고쳐줘야 할 필요가 있습니다.
> 아이콘의 이름이 전부 똑같지 않기 때문에 `icon set`이 변한다면 많은 작업이 요구된다.(모든 소스의 아이콘 이름을 변경해줘야함)
