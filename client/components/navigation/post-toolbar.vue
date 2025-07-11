<template>
<nav class="toolbar">
  <div class="toolbar__left">
    <ButtonGroup size="small">
      <Dropdown mode="hover">
        <template #trigger>
          <ButtonBasic type="text" icon-left="code" size="small">
            코드
          </ButtonBasic>
        </template>
        <Context
          :items="[
            { key: 'element-space', label: '공백', iconLeft: 'space' },
            { key: 'element-iframe', label: '아이프레임', iconLeft: 'tv' },
            { key: 'element-image', label: '이미지', iconLeft: 'image' },
          ]"
          @select="onClickItem($event.key)"/>
      </Dropdown>
      <Dropdown mode="hover">
        <template #trigger>
          <ButtonBasic type="text" icon-left="layout-grid" size="small">
            레이아웃
          </ButtonBasic>
        </template>
        <Context
          :items="[
            { key: 'layout-group', label: '그리드 그룹', iconLeft: 'layout-grid' },
            { key: 'layout-image', label: '그리드 이미지', iconLeft: 'images' },
          ]"
          @select="onClickItem($event.key)"/>
      </Dropdown>
      <ButtonBasic
        v-if="props.useFileManager"
        icon-left="paperclip"
        size="small"
        color="key"
        @click="onClickItem('open-file-manager')">
        첨부파일
      </ButtonBasic>
    </ButtonGroup>
    <Dropdown mode="hover">
      <template #trigger>
        <ButtonBasic type="text" icon-left="book" size="small" color="code">
          가이드
        </ButtonBasic>
      </template>
      <Context
        :items="[
          { label: '마크다운 사용법', href: 'https://gist.github.com/ihoneymon/652be052a0727ad59601' },
          { label: '붉은거위 마크다운 스타일', href: 'https://github.com/redgoose-dev/markdown-style/tree/main/guide' },
        ]"
        @select="onClickGuide"/>
    </Dropdown>
  </div>
  <div class="toolbar__right">
    <ButtonBasic
      v-if="props.usePreview"
      icon-left="eye"
      size="small"
      color="sub"
      @click="onClickItem('preview')">
      미리보기
    </ButtonBasic>
  </div>
</nav>
</template>

<script setup>
import { contentCode } from '../../modules/marked.js'
import { ButtonGroup, ButtonBasic } from '../button/index.js'
import { Dropdown, Context } from './dropdown/index.js'

const props = defineProps({
  useFileManager: Boolean,
  usePreview: Boolean,
})
const emits = defineEmits([ 'select' ])

function onClickItem(code)
{
  switch (code)
  {
    case 'element-space':
      emits('select', 'insert', {
        code: contentCode.space.code,
        cursor: contentCode.space.cursor,
      })
      break
    case 'element-iframe':
      emits('select', 'insert', {
        code: contentCode.iframe.code,
        cursor: contentCode.iframe.cursor,
      })
      break
    case 'element-image':
      emits('select', 'insert', {
        code: contentCode.image.code,
        cursor: contentCode.image.cursor,
      })
      break
    case 'layout-group':
      emits('select', 'insert', {
        code: contentCode.gridGroup.code,
        cursor: contentCode.gridGroup.cursor,
      })
      break
    case 'layout-image':
      emits('select', 'insert', {
        code: contentCode.gridItem.code,
        cursor: contentCode.gridItem.cursor,
      })
      break
    case 'open-file-manager':
    case 'preview':
      emits('select', code)
      break
  }
}
function onClickGuide({ href })
{
  if (!href) return
  window.open(href)
}
</script>

<style src="./post-toolbar.scss" lang="scss" scoped></style>
