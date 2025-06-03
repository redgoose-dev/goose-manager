<template>
<header class="toolbar">
  <nav class="toolbar__column">
    <ButtonGroup>
      <Dropdown mode="hover" class="toolbar__context">
        <template #trigger>
          <ButtonBasic
            size="small"
            color="key"
            icon-left="upload"
            class="button-upload"
            @click="fileManagerEvent.upload('upload-file')">
            업로드
          </ButtonBasic>
        </template>
        <Context
          :items="[
            { key: 'upload-file', label: '파일 업로드', iconRight: 'upload' },
            { key: 'upload-url', label: 'URL 업로드', iconRight: 'link' },
          ]"
          @select="(e) => fileManagerEvent.upload(e.key)"/>
      </Dropdown>
      <ButtonBasic
        size="small"
        icon-left="square-check-big"
        :color="fileManager._existItem ? 'sub' : ''"
        :disabled="!fileManager._existItem"
        @click="onClickSelectAll">
        모두선택
      </ButtonBasic>
      <ButtonBasic
        size="small"
        color="error"
        icon-left="trash-2"
        :disabled="!fileManager._existSelected"
        @click="onClickDelete">
        삭제
      </ButtonBasic>
      <Dropdown
        v-if="_useThumbnail"
        mode="hover"
        position="left"
        class="toolbar__context">
        <template #trigger>
          <ButtonBasic
            type="button"
            size="small"
            icon-left="image"
            @click="onSelectContextFromThumbnail(thumbnailContextKey.PREVIEW)">
            썸네일
          </ButtonBasic>
        </template>
        <Context
          :items="[
            { key: thumbnailContextKey.EDIT, label: '편집하기', iconRight: 'crop' },
            { key: thumbnailContextKey.PREVIEW, label: '이미지 프리뷰', iconRight: 'scan-search' },
            { key: thumbnailContextKey.RESET, label: '설정 재설정', iconRight: 'rotate-ccw' },
          ]"
          @select="(e) => onSelectContextFromThumbnail(e.key)"/>
      </Dropdown>
    </ButtonGroup>
  </nav>
  <nav class="toolbar__column">
    <p class="info">
      업로드: <em>{{fileManager._countItems}} / {{fileManager.preference.limitCount}}</em>
    </p>
    <ButtonGroup>
      <Dropdown
        mode="hover"
        position="right"
        :disabled="!_useInsert"
        class="toolbar__context">
        <template #trigger>
          <ButtonBasic
            type="text"
            color="key"
            size="small"
            icon-left="between-horizontal-start"
            :disabled="!_useInsert"
            @click="insertSelectItems(insertMode.MARKDOWN)">
            첨부파일 삽입
          </ButtonBasic>
        </template>
        <Context
          :items="[
            { key: insertMode.MARKDOWN, label: '마크다운 코드삽입', iconRight: 'file-code-2' },
            { key: insertMode.ADDRESS, label: 'URL 주소삽입', iconRight: 'link' },
            { key: insertMode.HTML, label: 'HTML 코드삽입', iconRight: 'code-xml' },
          ]"
          @select="(e) => insertSelectItems(e.key)"/>
      </Dropdown>
    </ButtonGroup>
  </nav>
</header>
</template>

<script setup>
import { computed, inject } from 'vue'
import { sleep } from '../../libs/util.js'
import { insertMode, thumbnailContextKey } from './assets.js'
import { ButtonBasic, ButtonGroup } from '../button/index.js'
import { Context, Dropdown } from '../navigation/dropdown/index.js'

const fileManager = inject('file-manager')
const fileManagerEvent = inject('file-manager-event')
const error = inject('error')
const emits = defineEmits([ 'action' ])
const errorPath = [ 'components', 'file-manager', 'toolbar.vue' ]

const _useInsert = computed(() => {
  return fileManager._existSelected
})
const _useThumbnail = computed(() => {
  if (!fileManager.preference.useThumbnail) return false
  return !!fileManager.thumbnail?.srl
})

function onClickSelectAll()
{
  fileManager.selectAllFiles()
}

async function onClickDelete()
{
  if (!confirm('선택한 파일을 삭제할까요? 삭제하면 복구할 수 없습니다.')) return
  const index = fileManager._selectedFilesIndex
  fileManager.selectAllFiles(false)
  const _index = [ ...index ].reverse()
  for (const key of _index)
  {
    if (!fileManager.items[key]) continue
    await emits('action', 'delete-file', key)
    await sleep(200)
  }
}

function insertSelectItems(mode)
{
  fileManagerEvent.insert(fileManager._selectedFileItems, mode)
}

function onSelectContextFromThumbnail(key)
{
  fileManagerEvent.thumbnail(key)
}
</script>

<style src="./toolbar.scss" lang="scss" scoped></style>
