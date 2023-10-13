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
      <ButtonGroup>
        <Upload
          @upload-file="onClickUploadFiles"
          @upload-url="showUploadUrl = true"/>
        <ButtonBasic
          type="button"
          size="small"
          color="sub"
          icon-left="check-square"
          :disabled="disabledAssets"
          @click="onSelectAll()">
          모두선택
        </ButtonBasic>
        <ButtonBasic
          type="button"
          size="small"
          color="error"
          icon-left="trash-2"
          :disabled="selectedAssets"
          @click="onClickDeleteItems">
          삭제
        </ButtonBasic>
      </ButtonGroup>
      <ControlTheme/>
    </div>
    <p class="files-total">
      업로드: <em>{{localStore.global.index.length}}</em>
    </p>
  </header>
  <Loading v-if="loading" class="files-loading"/>
  <Attachments
    v-else
    ref="$attachments"
    :index="localStore.global.index"
    :processing="processing"
    @change-select="localStore.global.selected = $event"
    @select-context-item="onSelectContextItem"
    @upload="uploadFile($event, 0)"/>
  <footer class="files-footer">
    <nav class="files-footer__left"></nav>
    <nav class="files-footer__right">
      <div class="dropdown dropdown--right">
        <ButtonBasic
          type="button"
          color="key"
          icon-left="download"
          :disabled="selectedAssets"
          class="dropdown__button"
          @click="onClickFunction()">
          첨부파일 삽입
        </ButtonBasic>
        <div v-if="localStore.markdown" class="dropdown__context">
          <ul>
            <li>
              <button
                type="button"
                :disabled="disabledAssets"
                @click="onClickFunction('insert-markdown')">
                마크다운 코드삽입
              </button>
            </li>
            <li>
              <button
                type="button"
                :disabled="disabledAssets"
                @click="onClickFunction('insert-address')">
                주소 삽입
              </button>
            </li>
            <li>
              <button
                type="button"
                :disabled="disabledAssets"
                @click="onClickFunction('insert-html')">
                HTML 삽입
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </footer>
  <teleport to="#modals">
    <Modal
      :show="showUploadUrl"
      @close="showUploadUrl = false">
      <ModalBody type="window">
        <UrlUploader
          @close="showUploadUrl = false"
          @submit="submitUploadUrl"/>
      </ModalBody>
    </Modal>
  </teleport>
</article>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { preferenceStore } from '../../../store/preference'
import { fileManagerStore } from '../../../store/files-manager'
import { getItemsGlobal, uploadFileGlobal, removeFilesGlobal } from '../../../structure/files/manager'
import { err } from '../../../libs/error'
import { pureObject } from '../../../libs/object'
import { printf } from '../../../libs/string'
import { toast } from '../../../modules/toast'
import { createMarkdownItems, createHtmlItems } from '../itemsUtil'
import { Modal, ModalBody } from '../../modal'
import { ButtonBasic, ButtonGroup } from '../../button'
import Attachments from '../attachments/index.vue'
import Loading from '../../etc/loading.vue'
import UrlUploader from '../url-uploader/index.vue'
import ControlTheme from './assets/control-theme.vue'
import Upload from './assets/upload.vue'

const $file = ref()
const $attachments = ref()
const emits = defineEmits([ 'close', 'custom-event' ])
const preference = preferenceStore()
const localStore = fileManagerStore()
const loading = ref(true)
const processing = ref(false)
const showUploadUrl = ref(false)
const disabledAssets = computed(() => (loading.value || processing.value))
const selectedAssets = computed(() => {
  const limit = localStore.limitSelect
  const length = localStore.global.selected.length
  if (disabledAssets.value) return true
  if (length <= 0) return true
  return limit > 0 && limit < length
})

onMounted(async () => {
  try
  {
    localStore.global.index = await getItemsGlobal(preference.files.globalPath)
    localStore.global.idx = localStore.global.index.length
    loading.value = false
  }
  catch (err)
  {
    err([ '/components/files-manager/modules/global.vue', 'onMounted()' ], 'error', err.message)
    throw err.message
  }
})
defineExpose({
  selectAll: onSelectAll,
  func: onClickFunction,
})

/**
 * Upload files area
 */

// upload files
function onClickUploadFiles()
{
  $file.value.click()
}
async function onChangeFiles(e)
{
  const { files } = e.target
  if (processing.value || files.length <= 0) return
  processing.value = true
  await uploadFile(files, 0)
}
async function uploadFile(files, n)
{
  let idx
  try
  {
    idx = localStore.global.index.push({ ready: true })
    idx = idx - 1
    const res = await uploadFileGlobal(files[n], preference.files.globalPath)
    localStore.global.index.splice(idx, 1, {
      ...res,
      selected: false,
      key: localStore.global.idx,
    })
    localStore.global.idx = localStore.global.idx + 1
    // next queue
    n++
    if (files.length <= n)
    {
      completeUploadFiles()
      return
    }
    if (files.length > n) await uploadFile(files, n)
  }
  catch (err)
  {
    if (localStore.global.index[idx].ready) localStore.global.index.pop()
    errorUploadFiles(err)
  }
}
function completeUploadFiles()
{
  $attachments.value.reset()
  $file.value.value = ''
  processing.value = false
}
function errorUploadFiles(e)
{
  $attachments.value.reset()
  processing.value = false
  err([ '/components/files-manager/modules/global.vue', 'errorUploadFiles()' ], 'error', e.message)
  toast.add('Failed upload files.', 'error')
}

/**
 * Upload url
 */

async function submitUploadUrl(files)
{
  showUploadUrl.value = false
  await uploadFile(files, 0)
}

/**
 * delete files area
 */

async function deleteItems(paths)
{
  onSelectAll(false)
  let res = await removeFilesGlobal(paths)
  let newIndex = pureObject(localStore.global.index)
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
  localStore.global.index = newIndex.filter(Boolean)
  await nextTick()
  $attachments.value.reset()
  toast.add('첨부파일을 삭제했습니다.', 'success').then()
}
function onDeleteItem(key)
{
  if (key === undefined) return
  if (!confirm(`이 항목을 삭제할까요?\n파일을 삭제하면 복구할 수 없습니다.`)) return
  onSelectAll(false)
  let paths = [{ key, path: localStore.global.index[key].path }]
  deleteItems(paths).then()
}
function onClickDeleteItems()
{
  if (localStore.global.selected.length <= 0) return
  if (!confirm(printf('정말 {0}개의 파일을 삭제할까요?', String(localStore.global.selected.length)))) return
  let paths = localStore.global.selected.map(key => {
    if (!localStore.global.index[key]) return false
    return { key, path: localStore.global.index[key].path }
  }).filter(Boolean)
  deleteItems(paths).then()
}

/**
 * ETC area
 */

function onSelectAll(sw)
{
  $attachments.value.selectAll(sw)
}

function onClickFunction(key)
{
  if (!key) key = localStore.markdown ? 'insert-markdown' : 'insert-raw'
  if (localStore.limitSelect > 0 && localStore.global.selected.length > localStore.limitSelect) return
  let items = localStore.global.selected.map(key => {
    if (!localStore.global.index[key]) return false
    const { name, pathFull, type } = localStore.global.index[key]
    return {
      type,
      name,
      path: pathFull,
    }
  }).filter(Boolean)
  switch (key)
  {
    case 'insert-raw':
      if (items.length <= 0) return
      emits('custom-event', {
        key: 'insert-raw',
        value: items,
      })
      break
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
        value: items.map(o => (o.path)),
      })
      break
  }
}

function onSelectContextItem(key, type)
{
  const src = localStore.global.index[key]
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
      path = localStore.global.index[key]?.pathFull
      if (path) window.open(path)
      break
    case 'insert-markdown':
      emits('custom-event', {
        key: 'insert-text',
        value: createMarkdownItems([item]),
      })
      break
    case 'insert-raw':
      emits('custom-event', {
        key: 'insert-raw',
        value: [item],
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
        value: [item].map(o => (o.path)),
      })
      break
    case 'delete':
      onDeleteItem(key)
      break
  }
}
</script>

<style lang="scss" scoped>
@import './modules.scss';
</style>
