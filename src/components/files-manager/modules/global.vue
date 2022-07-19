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
        :disabled="disabledAssets"
        @click="onClickUploadFiles">
        Upload files
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
    <p class="files-total">Count: <em>{{localStore.global.index.length}}</em></p>
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
</article>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { preferenceStore } from '../../../store/preference'
import { fileManagerStore } from '../../../store/tool-manager'
import { getItemsGlobal, uploadFileGlobal, removeFilesGlobal } from '../../../structure/files/manager'
import { err } from '../../../libs/error'
import { pureObject } from '../../../libs/object'
import { printf } from '../../../libs/string'
import { message } from '../../../message'
import { toast } from '../../../modules/toast'
import { createMarkdownItems, createHtmlItems, createAddressItems } from '../itemsUtil'
import { ButtonBasic } from '../../button'
import Attachments from '../attachments/index.vue'
import Loading from '../../etc/loading.vue'

const $file = ref<any>()
const $attachments = ref<any>()
const emits = defineEmits([ 'close', 'custom-event' ])
const preference = preferenceStore()
const localStore = fileManagerStore()
const loading = ref<boolean>(true)
const processing = ref<boolean>(false)
const disabledAssets = computed<boolean>(() => (loading.value || processing.value))
const selectedAssets = computed<boolean>(() => {
  if (disabledAssets.value) return true
  return localStore.global.selected.length <= 0
})

// upload files
function onClickUploadFiles(): void
{
  $file.value.click()
}
async function onChangeFiles(e: any): Promise<void>
{
  const { files } = e.target
  if (processing.value || files.length <= 0) return
  processing.value = true
  await uploadFile(files, 0)
}
async function uploadFile(files: FileList, n: number): Promise<void>
{
  let idx: any
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
  catch (err: any)
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
function errorUploadFiles(e: ErrorEvent)
{
  $attachments.value.reset()
  processing.value = false
  err([ '/components/files-manager/modules/global.vue', 'errorUploadFiles()' ], 'error', e.message)
  toast.add('Failed upload files.', 'error')
}

async function deleteItems(paths: {}[])
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
  toast.add('첨부파일을 삭제했습니다.', 'success')
}
function onDeleteItem(key: number|undefined): void
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
  if (!confirm(printf(message.confirm.deleteFiles, String(localStore.global.selected.length)))) return
  let paths = localStore.global.selected.map(key => {
    if (!localStore.global.index[key]) return false
    return { key, path: localStore.global.index[key].path }
  }).filter(Boolean)
  deleteItems(paths).then()
}

function onSelectAll(sw?: boolean): void
{
  $attachments.value.selectAll(sw)
}

function onClickFunction(key: string|undefined)
{
  if (key === undefined) return
  let items = localStore.global.selected.map(key => {
    const { name, pathFull, type } = localStore.global.index[key]
    return {
      name,
      path: pathFull,
      type,
    }
  })
  switch (key)
  {
    case 'insert-markdown':
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
  }
}

function onSelectContextItem(key: number, type: string): void
{
  const src = localStore.global.index[key]
  if (!src) return
  const item = {
    name: src.name,
    path: src.pathFull,
    type: src.type,
  }
  let path: string
  switch (type)
  {
    case 'open-new-window':
      path = localStore.global.index[key]?.pathFull
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
    case 'delete':
      onDeleteItem(key)
      break
  }
}

onMounted(async () => {
  try
  {
    localStore.global.index = await getItemsGlobal(preference.files.globalPath)
    localStore.global.idx = localStore.global.index.length
    loading.value = false
  }
  catch (err: any)
  {
    err([ '/components/files-manager/modules/global.vue', 'onMounted()' ], 'error', err.message)
    throw err.message
  }
})

defineExpose({
  selectAll: onSelectAll,
  func: onClickFunction,
})
</script>

<style src="./modules.scss" lang="scss" scoped></style>
