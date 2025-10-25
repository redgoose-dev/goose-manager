<template>
<article
  ref="$content"
  class="content"
  @dragover="onOverFile"
  @dragleave="onLeaveFile"
  @drop="onDropFile">
  <Toolbar ref="$toolbar" @action="onActionToolbar"/>
  <div v-if="state.loading" class="content-loading">
    <Loading class="loading"/>
  </div>
  <div
    v-else-if="fileManager._existItem"
    class="content-items"
    @click="onClickSpace">
    <ul class="files">
      <li v-for="file in _files" @click.stop>
        <Progress
          v-if="file.total"
          :total="file.total"
          :loaded="file.loaded"/>
        <File
          v-else-if="file.idx && file.srl"
          :idx="file.idx"
          :srl="file.srl"
          :name="file.name"
          :mime="file.mime"
          :selected="!!file.selected"
          :badge="file.badge || []"
          @select="onSelect"
          @select-context-item="onSelectContextItem"/>
      </li>
    </ul>
  </div>
  <Empty v-else title="No file" message="파일이 없습니다." class="empty"/>
  <teleport to="#modals">
    <div :class="[ 'overlay-dropzone', state.dropZone && 'active' ]">
      <span>Drop files here!</span>
    </div>
  </teleport>
</article>
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted, onBeforeUnmount } from 'vue'
import { authStore } from '../../store/auth.js'
import { downloadFile } from '../../libs/file.js'
import { request } from '../../libs/api.js'
import { sleep } from '../../libs/util.js'
import { pureObject } from '../../libs/object.js'
import { convertDataToFileItem, getFile } from './libs.js'
import { fileContextKey, insertMode, thumbnailContextKey } from './assets.js'
import Loading from '../content/loading.vue'
import Empty from '../content/empty.vue'
import { File, Progress } from './item/index.js'
import Toolbar from './toolbar.vue'

const $toolbar = ref()
const $content = ref()
const fileManager = inject('file-manager')
const fileManagerEvent = inject('file-manager-event')
const error = inject('error')
const errorPath = [ 'components', 'file-manager', 'content.vue' ]
const auth = authStore()
const state = reactive({
  loading: false,
  dragEvent: false,
  dropZone: false,
})

const _files = computed(() => {
  const index = fileManager.index
    .map(idx => {
      const item = fileManager.items[idx]
      if (!item) return false

      return {
        ...item,
        idx,
        selected: fileManager.selected[idx],
        badge: [
          fileManager.thumbnail?.originSrl === item.srl && 'thumbnail',
        ].filter(Boolean),
      }
    })
  return index.filter(Boolean)
})

onMounted(async () => {
  try
  {
    if (!fileManager.initialized)
    {
      state.loading = true
      const { module, moduleSrl } = fileManager.preference
      if (!(module && moduleSrl))
      {
        throw new Error('module, moduleSrl 값이 필요합니다.')
      }
      const res = await request('/file/', {
        query: {
          module,
          module_srl: moduleSrl,
          unlimited: '1',
          order: 'srl',
          sort: 'asc',
        },
      })
      if (res?.data?.index?.length > 0)
      {
        res.data.index.forEach(item => {
          if (item.json.thumbnail)
          {
            fileManager.thumbnail = {
              srl: item.srl,
              code: item.code,
              coordinates: item.json.thumbnail.coordinates,
              originSrl: item.json.thumbnail.originSrl,
            }
          }
          else
          {
            fileManager.addFile(convertDataToFileItem(item))
          }
        })
      }
      fileManager.initialized = true
    }
    if (window.File && window.FileList && window.FileReader && window.Blob)
    {
      state.dragEvent = true
    }
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '첨부파일 목록을 가져오지 못했습니다.',
      error: e,
      useToast: false,
    })
  }
  finally
  {
    state.loading = false
  }
})
onBeforeUnmount(() => {
  if (!state.dragEvent) return
  state.dragEvent = false
})

function onSelect(idx, $event)
{
  fileManager.selectFile(idx, $event)
}
function onClickSpace()
{
  fileManager.selectAllFiles(false)
}

async function onSelectContextItem(idx, code)
{
  const item = fileManager.items[idx]
  if (!item)
  {
    error.catch({
      path: [ ...errorPath, 'onSelectContextItem()' ],
      message: '기능을 실행할 아이템이 없습니다.',
    })
    return
  }
  switch (code)
  {
    case fileContextKey.OPEN_NEW_WINDOW:
      openWindow(item.srl).then()
      break
    case fileContextKey.DOWNLOAD:
      download(item.srl, item.name).then()
      break
    case fileContextKey.SET_THUMBNAIL:
      fileManagerEvent.thumbnail(thumbnailContextKey.EDIT, idx)
      break
    case fileContextKey.INSERT_MARKDOWN:
      fileManagerEvent.insert([ pureObject(item) ], insertMode.MARKDOWN)
      break
    case fileContextKey.INSERT_ADDRESS:
      fileManagerEvent.insert([ pureObject(item) ], insertMode.ADDRESS)
      break
    case fileContextKey.INSERT_HTML:
      fileManagerEvent.insert([ pureObject(item) ], insertMode.HTML)
      break
    case fileContextKey.DELETE:
      if (!confirm('선택한 파일을 삭제할까요? 삭제하면 복구할 수 없습니다.')) return
      fileManagerEvent.deleteFile(idx).then()
      break
  }
}
async function openWindow(srl)
{
  try
  {
    const url = await getFile(srl, 'url')
    window.open(url)
    await sleep(100)
    URL.revokeObjectURL(url)
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'openWindow()' ],
      message: '파일을 열지 못했습니다.',
      error: e,
    })
  }
}
async function download(srl, name)
{
  try
  {
    const url = await getFile(srl, 'url')
    downloadFile(url, name)
    await sleep(100)
    URL.revokeObjectURL(url)
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'download()' ],
      message: '파일을 다운로드 실패했습니다.',
      error: e,
    })
  }
}

async function onActionToolbar(type, value)
{
  switch (type)
  {
    case 'delete-file':
      await fileManagerEvent.deleteFile(value)
      break
  }
}

function onOverFile(e)
{
  if (!state.dragEvent) return
  e.preventDefault()
  if (state.dropZone) return
  state.dropZone = true
}
function onLeaveFile(e)
{
  if (!state.dragEvent) return
  e.preventDefault()
  if (!state.dropZone) return
  const related = e.relatedTarget
  if (related && $content.value && $content.value.contains(related)) return
  state.dropZone = false
}
function onDropFile(e)
{
  if (!state.dragEvent) return
  e.preventDefault()
  if (!state.dropZone) return
  state.dropZone = false
  const files = (e.dataTransfer) ? e.dataTransfer.files : undefined
  fileManagerEvent.uploadFiles(files).then()
}

</script>

<style src="./content.scss" lang="scss" scoped></style>
