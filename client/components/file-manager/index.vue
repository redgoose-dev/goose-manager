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
          :options="modal.thumbnailEditor.options"
          :crop-size="[ 640, 480 ]"
          @close="onCloseThumbnailEditor"
          @submit="onSubmitThumbnailEditor"/>
      </ModalWindow>
    </Modal>
    <Lightbox
      :src="modal.thumbnailPreview.src"
      :use-fetch="fileManager.preference.useFetch"
      @close="onControlThumbnailPreview(false)"/>
    <Modal :open="modal.urlUploader">
      <ModalWindow>
        <p>sdog</p>
      </ModalWindow>
    </Modal>
  </teleport>
</article>
</template>

<script setup>
import { ref, reactive, provide, inject, onMounted, onBeforeUnmount } from 'vue'
import fileManagerStore from './store.js'
import { request, upload, formData } from '../../libs/api.js'
import { fileUploader } from '../../libs/file.js'
import { printf } from '../../libs/strings.js'
import { convertOutputCode, convertDataToFileItem } from './libs.js'
import { windowKey, thumbnailContextKey, insertMode } from './assets.js'
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
  useFetch: Boolean,
})
const emits = defineEmits([ 'insert', 'update-thumbnail' ])
const $content = ref()
const loading = ref(true)
const modal = reactive({
  thumbnailEditor: {
    open: false,
    src: '',
    options: {},
  },
  thumbnailPreview: {
    src: '',
  },
  urlUploader: false,
})
const errorPath = [ 'components', 'file-manager', 'index.vue' ]

// setup file manager store
const fileManager = fileManagerStore()
const error = inject('error')
provide('file-manager', fileManager)
provide('file-manager-event', {
  setup: onSetup,
  destroy: onDestroy,
  insert: onInsert,
  thumbnail: onRouteThumbnail,
  uploadFile: onUploadFile,
  deleteFile: onDeleteFile,
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
  switch (e.key)
  {
    case 'Enter':
      e.preventDefault()
      onInsert(fileManager._selectedFileItems, insertMode.MARKDOWN)
      break
    case 'a':
      e.preventDefault()
      fileManager.selectAllFiles(true)
      break
    case 'u':
      e.preventDefault()
      onUploadFile().then()
      break
  }
}
function shortcutEscape()
{
  const key = fileManager.windows[fileManager.windows.length - 1]
  switch(key)
  {
    case windowKey.THUMBNAIL_EDITOR:
      onCloseThumbnailEditor()
      break
    case windowKey.THUMBNAIL_PREVIEW:
      onControlThumbnailPreview(false)
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
    useFetch: props.useFetch,
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

async function onUploadFile()
{
  try
  {
    const files = await fileUploader({
      accept: fileManager.preference.acceptFileType,
      multiple: true,
    })
    if (files?.length > 0) await uploadFile(files)
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onUploadFile()' ],
      message: typeof e === 'string' ? e : '파일 업로드 실패',
      error: typeof e === 'string' ? new Error(e) : e,
    })
  }
}
/**
 * upload file
 * @param {File[]} files
 * @return {Promise<void>}
 */
function uploadFile(files)
{
  const [ file, ...remainingFiles ] = files
  let idx = undefined
  function nextFile(remainFiles, resolve)
  {
    if (remainFiles.length > 0)
    {
      setTimeout(() => {
        uploadFile(remainFiles)
          .catch(e => error.catch({
            path: [ ...errorPath, 'uploadFile()' ],
            message: typeof e === 'string' ? e : '파일 업로드 실패',
            error: typeof e === 'string' ? new Error(e) : e,
          }))
      }, 100)
    }
    else resolve()
  }
  return new Promise((resolve, reject) => {
    if (!file) return
    // checking limit file size
    if (file.size > fileManager.preference.limitSize)
    {
      return nextFile(remainingFiles, resolve)
    }
    // checking limit file count
    if (fileManager._countItems >= fileManager.preference.limitCount)
    {
      return reject(printf('업로드할 수 있는 파일 갯수는 {0}개 입니다.', fileManager.preference.limitCount))
    }
    // upload file
    upload({
      method: 'put',
      url: '/file/',
      data: {
        module: fileManager.preference.module,
        module_srl: fileManager.preference.moduleSrl,
        json: JSON.stringify({ foo: 'bar' }),
        file,
      },
      onProgress: (total, loaded) => {
        if (idx === undefined)
        {
          idx = fileManager.addFile({ total, loaded })
        }
        else
        {
          fileManager.updateFile(idx, { total, loaded })
        }
      },
      onComplete: (res) => {
        if (res?.data)
        {
          fileManager.updateFile(idx, convertDataToFileItem(res.data))
          nextFile(remainingFiles, resolve)
        }
        else
        {
          fileManager.removeFile(idx)
          reject('파일 데이터가 없습니다.')
        }
      },
      onError: (e) => reject(e.message),
    })
  })
}

/**
 * delete file
 * @param {number} key
 * @return {Promise<void>}
 */
async function onDeleteFile(key)
{
  try
  {
    const srl = fileManager.items[key]?.srl
    if (!srl) throw new Error('Not found srl.')
    fileManager.removeFile(key)
    await request(`/file/${srl}/`, { method: 'delete' })
    // delete thumbnail file
    if (fileManager.thumbnail && srl === fileManager.thumbnail.originSrl)
    {
      await request(`/file/${fileManager.thumbnail.srl}/`, { method: 'delete' })
      fileManager.thumbnail = undefined
    }
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onDeleteFile()' ],
      message: '파일을 삭제하지 못했습니다.',
      error: e,
    })
  }
}

function onRouteThumbnail(key, idx)
{
  switch (key)
  {
    case thumbnailContextKey.EDIT:
      if (idx)
      {
        openThumbnailEditor(idx)
      }
      else if (fileManager.thumbnail?.srl)
      {
        openThumbnailEditor()
      }
      break
    case thumbnailContextKey.PREVIEW:
      onControlThumbnailPreview(true)
      break
    case thumbnailContextKey.RESET:
      onResetThumbnail().then()
      break
  }
}
function openThumbnailEditor(idx)
{
  const item = fileManager.items[idx]
  if (item)
  {
    if (item.srl === fileManager.thumbnail?.originSrl)
    {
      modal.thumbnailEditor.src = `/file/${item.srl}/`
      modal.thumbnailEditor.options.coordinates = fileManager.thumbnail.coordinates
    }
    else
    {
      modal.thumbnailEditor.src = `/file/${item.srl}/`
    }
    modal.thumbnailEditor.options.srl = item.srl
  }
  else if (fileManager.thumbnail)
  {
    modal.thumbnailEditor.src = `/file/${fileManager.thumbnail.originSrl}/`
    modal.thumbnailEditor.options.srl = fileManager.thumbnail.originSrl
    modal.thumbnailEditor.options.coordinates = fileManager.thumbnail.coordinates || undefined
  }
  else
  {
    return
  }
  fileManager.controlWindow(true, windowKey.THUMBNAIL_EDITOR)
  modal.thumbnailEditor.open = true
}
function onCloseThumbnailEditor()
{
  fileManager.controlWindow(false, windowKey.THUMBNAIL_EDITOR)
  modal.thumbnailEditor.open = false
  modal.thumbnailEditor.src = ''
  modal.thumbnailEditor.options = {}
}
async function onSubmitThumbnailEditor({ coordinates, file, options })
{
  try
  {
    if (fileManager.thumbnail?.srl)
    {
      await request(`/file/${fileManager.thumbnail.srl}/`, {
        method: 'patch',
        body: formData({
          file,
          json: JSON.stringify({
            thumbnail: {
              originSrl: options.srl,
              coordinates,
            },
          })
        }),
      })
      fileManager.thumbnail.coordinates = coordinates
      fileManager.thumbnail.originSrl = options.srl
    }
    else
    {
      const res = await request('/file/', {
        method: 'put',
        body: formData({
          module: fileManager.preference.module,
          module_srl: fileManager.preference.moduleSrl,
          file,
          json: JSON.stringify({
            thumbnail: {
              originSrl: options.srl,
              coordinates,
            },
          }),
        }),
      })
      if (!res.data?.srl) throw new Error('Not found response data')
      fileManager.thumbnail = {
        srl: res.data.srl,
        coordinates,
        originSrl: options.srl,
      }
    }
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onSubmitThumbnailEditor()' ],
      message: '썸네일 이미지 업데이트 실패',
      error: e,
    })
  }
  finally
  {
    onCloseThumbnailEditor()
  }
}
function onControlThumbnailPreview(sw)
{
  if (sw)
  {
    if (!fileManager.thumbnail?.srl) return
    fileManager.controlWindow(true, windowKey.THUMBNAIL_PREVIEW)
    modal.thumbnailPreview.src = `/file/${fileManager.thumbnail.srl}/`
  }
  else
  {
    fileManager.controlWindow(false, windowKey.THUMBNAIL_PREVIEW)
    modal.thumbnailPreview.src = ''
  }
}
async function onResetThumbnail()
{
  if (!fileManager.thumbnail?.srl) return
  if (!confirm('재설정하면 썸네일 이미지와 설정 정보가 전부 삭제됩니다.\n재설정 하시겠습니까?')) return
  try
  {
    await request(`/file/${fileManager.thumbnail.srl}/`, { method: 'delete' })
    fileManager.thumbnail = undefined
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onResetThumbnail()' ],
      message: '썸네일 이미지 초기화 실패',
      error: e,
    })
  }
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
