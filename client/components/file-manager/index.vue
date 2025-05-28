<template>
<article class="file-manager">
  <slot name="header"/>
  <Content ref="$content" v-if="!loading"/>
  <slot name="footer"/>
  <teleport to="#modals">
    <Modal
      :open="modal.thumbnailEditor.open"
      mode="window"
      @close="onCloseThumbnailEditor">
      <ModalWindow class="thumbnail-editor-window">
        <ThumbnailEditor
          :src="modal.thumbnailEditor.src"
          :crop-size="[ 640, 480 ]"
          :default-coordinates="modal.thumbnailEditor.coordinates"
          @close="onCloseThumbnailEditor"
          @submit="onSubmitThumbnailEditor"/>
      </ModalWindow>
    </Modal>
    <Lightbox
      :src="modal.thumbnailPreview.src"
      :title="modal.thumbnailPreview.name"
      :use-fetch="true"/>
    <Modal :open="modal.urlUploader">
      <ModalWindow>
        <p>sdog</p>
      </ModalWindow>
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
import { ThumbnailEditor } from './thumbnail/index.js'
import Lightbox from '../content/lightbox.vue'

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
  thumbnailEditor: {
    open: false,
    src: '',
    coordinates: null,
  },
  thumbnailPreview: {
    src: '',
    name: '',
  },
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
  // TODO: 모달 윈도우창이 열릴때 스토어 window 값을 업데이트 해줘야 한다.
  switch (key)
  {
    case thumbnailContextKey.EDIT:
      if (fileManager.items[idx]?.srl)
      {
        modal.thumbnailEditor.src = `/file/${fileManager.items[idx].srl}/`
        modal.thumbnailEditor.open = true
        // TODO: 스토어 정보에 있는 originSrl 값과 `fileManager.items[idx].srl` 값이 같으면 스토어 정보에 있는 데이터를 이용해야 한다.
      }
      else if (fileManager.thumbnail?.srl)
      {
        modal.thumbnailEditor.open = true
        modal.thumbnailEditor.src = `/file/${fileManager.thumbnail.srl}/`
        // TODO: 여기 스토어 thumbnail 데이터를 사용해야 한다.
      }
      break
    case thumbnailContextKey.PREVIEW:
      if (!fileManager.thumbnail?.srl) return
      // TODO: 썸네일 정보가 있으면 미리보기를 한다.
      // TODO: 라이트박스를 연다.
      break
    case thumbnailContextKey.RESET:
      if (!confirm('재설정하면 썸네일 이미지와 설정 정보가 전부 삭제됩니다.\n재설정 하시겠습니까?')) return
      // TODO: 썸네일 정보가 있으면 정보를 지운다. API 파일도 삭제해야 할것이다.
      // fileManager.thumbnail = undefined
      break
  }
}
function onCloseThumbnailEditor()
{
  modal.thumbnailEditor.open = false
  modal.thumbnailEditor.src = ''
}
async function onSubmitThumbnailEditor({ coordinates, file })
{
  // TODO: 썸네일 이미지가 만들어졌다.
  // TODO: API로 파일을 업로드하거나 업데이트하기
  // TODO: 스토어 정보 업데이트하기
  console.log('onSubmitThumbnailEditor()', coordinates, file)
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
