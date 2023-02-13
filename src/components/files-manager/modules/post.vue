<template>
<article class="files">
  <div class="files-forms">
    <input
      ref="$file"
      type="file"
      :accept="localStore.acceptFileType"
      :disabled="disabledAssets"
      multiple
      @change="onChangeFiles">
  </div>
  <header class="files-header">
    <div class="files-header__left">
      <ButtonBasic
        type="button"
        size="small"
        color="key"
        :icon-left="processing ? 'loader' : 'upload'"
        :rotate-icon="processing"
        :disabled="disabledUploadButton"
        @click="onClickUploadFiles">
        Upload files
      </ButtonBasic>
      <ButtonBasic
        type="button"
        size="small"
        color="sub"
        icon-left="link-2"
        @click="showUploadUrl = true">
        Input URL
      </ButtonBasic>
      <ButtonBasic
        type="button"
        size="small"
        icon-left="minus-square"
        :disabled="disabledAssets"
        @click="onSelectAll()">
        Select all
      </ButtonBasic>
      <ButtonBasic
        type="button"
        size="small"
        color="error"
        icon-left="trash-2"
        :disabled="selectedAssets"
        @click="onClickDeleteItems">
        Delete
      </ButtonBasic>
    </div>
    <p class="files-total">
      Count:
      <em>{{localStore.post.index.length}} / {{localStore.post.limitCount}}</em>
    </p>
  </header>
  <Loading v-if="loading" class="files-loading"/>
  <Attachments
    v-else
    ref="$attachments"
    :index="localStore.post.index"
    :processing="processing"
    @change-select="localStore.post.selected = $event"
    @select-context-item="onSelectContextItem"
    @upload="uploadFile($event, 0)"/>
  <footer class="files-footer">
    <nav class="files-footer__left">
      <div v-if="localStore.useThumbnail" class="dropdown dropdown--left">
        <ButtonBasic
          type="label"
          icon-left="image"
          :disabled="!localStore.post.thumbnail.srl"
          class="dropdown__button">
          Thumbnail
        </ButtonBasic>
        <div class="dropdown__context">
          <ul>
            <li>
              <button type="button" @click="onResetThumbnail">
                Reset
              </button>
            </li>
            <li>
              <button type="button" @click="showThumbnailPreview = true">
                Preview
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <nav class="files-footer__right">
      <div class="dropdown dropdown--right">
        <ButtonBasic
          type="button"
          color="key"
          icon-left="download"
          :disabled="selectedAssets"
          class="dropdown__button"
          @click="onClickFunction('insert-markdown')">
          Insert assets
        </ButtonBasic>
        <div class="dropdown__context">
          <ul>
            <li>
              <button
                type="button"
                :disabled="disabledAssets"
                @click="onClickFunction('insert-markdown')">
                Insert markdown
              </button>
            </li>
            <li>
              <button
                type="button"
                :disabled="disabledAssets"
                @click="onClickFunction('insert-html')">
                Insert html
              </button>
            </li>
            <li>
              <button
                type="button"
                :disabled="disabledAssets"
                @click="onClickFunction('insert-address')">
                Insert address
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </footer>
  <teleport to="#modals">
    <Modal
      :show="showThumbnailEditor"
      @close="controlThumbnailEditor(false)">
      <ModalBody type="full">
        <ThumbnailEditor
          :srl="thumbnail.srl"
          :type="localStore.post.thumbnailType"
          :data="thumbnail.data"
          :cropper="thumbnail.cropper"
          @close="controlThumbnailEditor(false)"
          @submit="onSubmitThumbnailEditor"/>
      </ModalBody>
    </Modal>
    <Modal
      :show="showUploadUrl"
      @close="showUploadUrl = false">
      <ModalBody type="window">
        <UrlUploader
          @close="showUploadUrl = false"
          @submit="submitUploadUrl"/>
      </ModalBody>
    </Modal>
    <Modal
      :show="showThumbnailPreview"
      @close="showThumbnailPreview = false">
      <ModalBody type="full">
        <ThumbnailPreview
          :image="previewThumbnail"
          @close="showThumbnailPreview = false"/>
      </ModalBody>
    </Modal>
  </teleport>
</article>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { fileManagerStore } from '../../../store/tool-manager'
import { getItemsPost, removeFilesPost, uploadFilePost } from '../../../structure/files/manager'
import { createFullPath } from '../../../structure/files/util'
import { err } from '../../../libs/error'
import { pureObject } from '../../../libs/object'
import { printf, getByte } from '../../../libs/string'
import { message } from '../../../message'
import { toast } from '../../../modules/toast'
import { createMarkdownItems, createHtmlItems, createAddressItems } from '../itemsUtil'
import { Modal, ModalBody } from '../../modal'
import { ButtonBasic } from '../../button'
import Attachments from '../attachments/index.vue'
import Loading from '../../etc/loading.vue'
import ThumbnailEditor from '../thumbnail/editor.vue'
import ThumbnailPreview from '../thumbnail/preview.vue'
import UrlUploader from '../url-uploader/index.vue'

const $file = ref<any>()
const $attachments = ref<any>()
const emits = defineEmits([ 'close', 'custom-event' ])
const localStore = fileManagerStore()
const showThumbnailEditor = ref<boolean>(false)
const showThumbnailPreview = ref<boolean>(false)
const showUploadUrl = ref<boolean>(false)
const thumbnail = reactive<any>({ srl: NaN, data: {}, cropper: {} })
const loading = ref<boolean>(true)
const processing = ref<boolean>(false)
const disabledAssets = computed<boolean>(() => (loading.value || processing.value))
const disabledUploadButton = computed<boolean>(() => {
  if (disabledAssets.value) return true
  return localStore.post.limitCount <= localStore.post.index.length
})
const selectedAssets = computed<boolean>(() => {
  if (disabledAssets.value) return true
  return localStore.post.selected?.length <= 0
})
const previewThumbnail = computed<string>(() => {
  const { image, path }: any = localStore.post.thumbnail
  if (image) return image
  else if (path) return createFullPath(path)
  else return ''
})

onMounted(async () => {
  try
  {
    const { module, targetSrl } = localStore.post
    localStore.post.index = await getItemsPost(module, targetSrl)
    localStore.post.idx = localStore.post.index.length
    loading.value = false
  }
  catch (e: any)
  {
    err([ '/components/files-manager/modules/post.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})
defineExpose({
  selectAll: onSelectAll,
  func: onClickFunction,
})

/**
 * Upload files area
 */

function onClickUploadFiles(): void
{
  // 버튼을 눌렀을때 인풋폼을 트리거하는 역할을 한다.
  $file.value.click()
}
async function onChangeFiles(e: InputEvent): Promise<void>
{
  // 파일 인풋폼에서 첨부파일이 업데이트 되었을때 일어나는 이벤트
  const files: FileList = (e.target as any).files
  if (processing.value || files.length <= 0) return
  processing.value = true
  await uploadFile(files, 0)
}
async function uploadFile(files: FileList, n: number): Promise<void>
{
  // 파일 하나 올리기, 목록에서 더 올라가야할 파일이 생기면 재귀함수로 실행
  let idx: any
  const { module, targetSrl, index, limitCount, limitSize }: any = localStore.post
  // check files count
  if (limitCount <= index.length)
  {
    errorUploadFiles(undefined, printf('파일을 {0}개까지 업로드할 수 있습니다.', limitCount))
    return
  }
  // check files size
  if (limitSize < files[n].size)
  {
    errorUploadFiles(undefined, printf('파일 업로드 사이즈 제한은 {0}입니다.', getByte(limitSize)))
    return
  }
  try
  {
    idx = localStore.post.index.push({ ready: true, percent: 0 })
    idx = idx - 1
    const res = await uploadFilePost(files[n], module, targetSrl)
    localStore.post.index.splice(idx, 1, {
      ...res,
      selected: false,
      key: localStore.post.idx,
    })
    localStore.post.idx = localStore.post.idx + 1
    // next queue
    n++
    if (files.length <= n)
    {
      completeUploadFiles()
      return
    }
    if (files.length > n)
    {
      await uploadFile(files, n)
    }
  }
  catch (e)
  {
    if (index[idx].ready) localStore.post.index.pop()
    errorUploadFiles(e, 'Failed upload files.')
  }
}
function completeUploadFiles(): void
{
  $attachments.value.reset()
  $file.value.value = ''
  processing.value = false
}
function errorUploadFiles(e: any, message: string): void
{
  $attachments.value.reset()
  processing.value = false
  if (e)
  {
    err([ '/components/files-manager/modules/post.vue', 'errorUploadFiles()' ], 'error', e.message)
  }
  toast.add(message || e.message, 'error').then()
}

/**
 * Upload url
 */

async function submitUploadUrl(): Promise<void>
{
  // TODO: submit
}

/**
 * delete files area
 */

async function deleteItems(items: any[]): Promise<void>
{
  onSelectAll(false)
  let res = await removeFilesPost(items)
  let newIndex = pureObject(localStore.post.index)
  res.forEach(o => {
    switch (typeof o)
    {
      case 'number':
        newIndex[o] = false
        break
      case 'string':
        toast.add(o, 'error')
        break
    }
  })
  localStore.post.index = newIndex.filter(Boolean)
  $attachments.value.reset()
  toast.add(printf(message.success.delete, message.word.file), 'success').then()
}
function onDeleteItem(key: number|undefined): void
{
  if (key === undefined) return
  if (!confirm(message.confirm.deleteFile)) return
  onSelectAll(false)
  deleteItems([localStore.post.index[key] ? { key, srl: localStore.post.index[key]?.srl } : false].filter(Boolean)).then()
}
async function onClickDeleteItems(): Promise<void>
{
  if (localStore.post.selected.length <= 0) return
  if (!confirm(printf(message.confirm.deleteFileItems, String(localStore.post.selected.length)))) return
  let items = localStore.post.selected.map(key => {
    if (!localStore.post.index[key]) return false
    return { key, srl: localStore.post.index[key]?.srl }
  }).filter(Boolean)
  await deleteItems(items)
  $attachments.value.reset()
}

/**
 * Thumbnail area
 */

function controlThumbnailEditor(sw: boolean, key: number|undefined = undefined): void
{
  if (sw)
  {
    if (key === undefined) return
    const { post } = localStore
    thumbnail.srl = post.index[key].srl
    if (post.thumbnail?.srl && (post.thumbnail?.srl === post.index[key].srl))
    {
      thumbnail.data = {
        points: post.thumbnail.points,
        zoom: post.thumbnail.zoom,
        orientation: post.thumbnail.orientation,
      }
    }
    else
    {
      thumbnail.data = undefined
    }
    thumbnail.cropper = {
      image: post.index[key].pathFull,
      viewport: {
        width: 320,
        height: 240,
        type: 'square',
        ...localStore.post.cropper?.viewport,
      },
    }
  }
  else
  {
    thumbnail.srl = NaN
    thumbnail.cropper = {}
    thumbnail.data = undefined
  }
  showThumbnailEditor.value = sw
}
function onSubmitThumbnailEditor(data: any): void
{
  localStore.post.thumbnail = data
  emits('custom-event', {
    key: 'update-thumbnail',
    value: data,
  })
}
function onResetThumbnail(): void
{
  if (!confirm('썸네일 설정을 삭제할까요?')) return
  localStore.post.thumbnail = {}
  emits('custom-event', {
    key: 'update-thumbnail',
    value: null,
  })
}

/**
 * ETC area
 */

function onSelectAll(sw: boolean|undefined = undefined): void
{
  $attachments.value.selectAll(sw)
}
function onClickFunction(key: undefined|string): void
{
  if (key === undefined) return
  let items: any = []
  switch (key)
  {
    case 'insert-markdown':
    case 'insert-html':
    case 'insert-address':
      items = localStore.post.selected.map(key => {
        const { name, pathFull, type } = localStore.post.index[key]
        return {
          type,
          name,
          path: pathFull,
        }
      })
      break
  }
  switch (key)
  {
    case 'insert-markdown':
      if (items.length <= 0) return
      emits('custom-event', {
        key: 'insert-text',
        value: createMarkdownItems(items),
      })
      break
    case 'insert-html':
      emits('custom-event', {
        key: 'insert-text',
        value: createHtmlItems(items),
      })
      break
    case 'insert-address':
      emits('custom-event', {
        key: 'insert-text',
        value: createAddressItems(items),
      })
      break
    case 'close-thumbnail-editor':
      showThumbnailEditor.value = false
      break
    case 'close-thumbnail-preview':
      showThumbnailPreview.value = false
      break
    case 'close-url-uploader':
      showUploadUrl.value = false
      break
  }
}
function onSelectContextItem(key: number, type: string): void
{
  const src = localStore.post.index[key]
  if (!src) return
  const item = {
    name: src.name,
    path: src.pathFull,
    type: src.type,
  }
  let path
  switch (type)
  {
    case 'open-new-window':
      path = localStore.post.index[key]?.pathFull
      if (path) window.open(path)
      break
    case 'insert':
      emits('custom-event', {
        key: 'insert-text',
        value: createMarkdownItems([item]),
      })
      break
    case 'insert-html':
      emits('custom-event', {
        key: 'insert-text',
        value: createHtmlItems([item]),
      })
      break
    case 'insert-address':
      emits('custom-event', {
        key: 'insert-text',
        value: createAddressItems([item]),
      })
      break
    case 'set-thumbnail':
      controlThumbnailEditor(true, key)
      break
    case 'delete':
      onDeleteItem(key)
      break
  }
}
</script>

<style src="./modules.scss" lang="scss" scoped></style>
