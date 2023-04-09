<template>
<ToolbarWrap>
  <template #left>
    <ToolbarGroup>
      <ToolbarItem
        type="dropdown"
        title="엘리먼트 추가"
        icon="box"
        :context="[
          {
            label: '공백',
            click: () => onClickToolbarItem('insert-space'),
          },
          {
            label: '아이프레임',
            click: () => onClickToolbarItem('insert-iframe'),
          },
          {
            label: '이미지',
            click: () => onClickToolbarItem('insert-picture'),
          },
        ]"/>
      <ToolbarItem
        type="dropdown"
        title="레이아웃 에셋 추가"
        icon="grid"
        :context="[
          {
            label: '그리드 그룹',
            click: () => onClickToolbarItem('insert-grid-group'),
          },
          {
            label: '그리드 이미지',
            click: () => onClickToolbarItem('insert-grid-item'),
          },
        ]"/>
    </ToolbarGroup>
    <ToolbarGroup>
      <ToolbarItem
        type="dropdown"
        title="Guides"
        icon="book"
        :context="[
          {
            label: '존 그루버 마크다운 페이지 번역',
            href: 'https://nolboo.kim/blog/2013/09/07/john-gruber-markdown/',
            target: '_blank',
          },
          {
            label: '마크다운 사용법',
            href: 'https://gist.github.com/ihoneymon/652be052a0727ad59601',
            target: '_blank',
          },
        ]"/>
    </ToolbarGroup>
  </template>
  <template #right>
    <ToolbarGroup>
      <ToolbarItem
        type="button"
        title="open file manager"
        label="첨부파일"
        icon="archive"
        color="key"
        @click="onClickToolbarItem('open-file-manager')"/>
      <ToolbarItem
        type="button"
        title="open preview"
        label="미리보기"
        icon="eye"
        @click="onClickToolbarItem('preview')"/>
    </ToolbarGroup>
  </template>
</ToolbarWrap>
</template>

<script setup>
import { ToolbarWrap, ToolbarGroup, ToolbarItem } from './toolbar'

const emits = defineEmits([ 'select-item' ])

function onClickToolbarItem(code)
{
  emits('select-item', code)
}
</script>
