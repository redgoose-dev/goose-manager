<template>
<article class="file-manager">
  <slot name="header"/>
  <Content ref="$content" v-if="!loading"/>
  <slot name="footer"/>
  <teleport to="#modals">
    <Modal :open="modal.thumbnailEditor">
      <p>sdog</p>
    </Modal>
    <Modal :open="modal.thumbnailPreview">
      <p>sdog</p>
    </Modal>
    <Modal :open="modal.urlUploader">
      <p>sdog</p>
    </Modal>
  </teleport>
</article>
</template>

<script setup>
import { ref, reactive, provide, onMounted, onBeforeUnmount } from 'vue'
import { windowKey, thumbnailContextKey } from './assets.js'
import { convertOutputCode } from './libs.js'
import fileManagerStore from './store.js'
import { Modal, ModalWindow } from '../modal/index.js'
import Content from './content.vue'

/**
 * props guide
 * shortcut?: boolean
 * module?: 'article'|'comment'|'checklist'|'json'
 * moduleSrl?: number
 */
const props = defineProps({
  shortcut: Boolean,
  module: String,
  moduleSrl: Number,
  useThumbnail: Boolean,
})
const emits = defineEmits([ 'insert', 'update-thumbnail' ])
const $content = ref()
const loading = ref(true)
const modal = reactive({
  thumbnailEditor: false,
  thumbnailPreview: false,
  urlUploader: false,
})

// setup file manager store
const fileManager = fileManagerStore()
provide('file-manager', fileManager)
provide('file-manager-event', {
  setup: onSetup,
  destroy: onDestroy,
  insert: onInsert,
  thumbnail: onRouteThumbnail,
})

// lifecycles
onMounted(() => onSetup())
onBeforeUnmount(() => onDestroy())

function onKeyup(e)
{
  e.preventDefault()
  switch (e.key)
  {
    case 'Escape':
      shortcutEscape()
      break
  }
}
function onKeydown(e)
{
  if (!(e.ctrlKey || e.metaKey)) return
  // console.log('onKeydown()', e.key)
  // TODO: 키 조합 (cmd+a, cmd+enter, cmd+u)
  switch (e.key)
  {
    case 'Enter':
      e.preventDefault()
      break
    case 'a':
      e.preventDefault()
      break
  }
}
function shortcutEscape()
{
  // TODO: esc 키를 누르면 현재 열려있는 모달을 닫는다.
  // console.log('shortcutEscape()')
  let key = ''
  switch(key)
  {
    case windowKey.THUMBNAIL_EDITOR:
      break
    case windowKey.THUMBNAIL_PREVIEW:
      break
    case windowKey.URL_UPLOADER:
      break
  }
}

function onSetup()
{
  fileManager.setup({
    module: props.module,
    moduleSrl: props.moduleSrl,
    shortcut: Boolean(props.shortcut),
    useThumbnail: props.useThumbnail,
  })
  if (fileManager.preference.shortcut)
  {
    window.addEventListener('keyup', onKeyup)
    window.addEventListener('keydown', onKeydown)
  }
  loading.value = false
}
function onDestroy()
{
  if (fileManager.preference.shortcut)
  {
    window.removeEventListener('keyup', onKeyup)
    window.removeEventListener('keydown', onKeydown)
  }
  fileManager.destroy()
  loading.value = true
}
function onInsert(files, mode)
{
  if (!(files?.length > 0)) return ''
  const str = convertOutputCode(files, mode)
  emits('insert', str)
}

function onRouteThumbnail(key, idx)
{
  console.log('onRouteThumbnail()', key, idx)
  switch (key)
  {
    case thumbnailContextKey.EDIT:
      if (idx)
      {
        // TODO: 에디터를 연다. 에디터에서 썸네일 정보를 검사하고 합친다.
      }
      else if (fileManager.thumbnail)
      {
        // TODO: 썸네일 정보가 있다면 에디터를 연다.
      }
      break
    case thumbnailContextKey.PREVIEW:
      // TODO: 썸네일 정보가 있으면 미리보기를 한다.
      break
    case thumbnailContextKey.RESET:
      // TODO: 썸네일 정보가 있으면 정보를 지운다. API 파일도 삭제해야 할것이다.
      // fileManager.thumbnail = undefined
      break
  }
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
