<template>
<article class="content">
  <Toolbar @action="onActionToolbar"/>
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
</article>
</template>

<script setup>
import { reactive, computed, inject, onMounted } from 'vue'
import { authStore } from '../../store/auth.js'
import { downloadFile } from '../../libs/file.js'
import { request, upload } from '../../libs/api.js'
import { printf } from '../../libs/strings.js'
import { sleep } from '../../libs/util.js'
import { pureObject } from '../../libs/object.js'
import { convertDataToFileItem, getFile } from './libs.js'
import { fileContextKey, insertMode, thumbnailContextKey } from './assets.js'
import Loading from '../content/loading.vue'
import Empty from '../content/empty.vue'
import { File, Progress } from './item/index.js'
import Toolbar from './toolbar.vue'

const fileManager = inject('file-manager')
const fileManagerEvent = inject('file-manager-event')
const error = inject('error')
const auth = authStore()
const state = reactive({
  loading: false,
})
const errorPath = [ 'components', 'file-manager', 'content.vue' ]

const _files = computed(() => {
  const index = fileManager.index
    .map(idx => {
      const item = fileManager.items[idx]
      if (!item) return false
      return {
        ...item,
        idx,
        selected: fileManager.selected[idx],
        // badge: [ 'thumbnail' ], // TODO
      }
    })
  return index.filter(Boolean)
})

onMounted(async () => {
  try
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
        unlimited: 1,
      },
    })
    if (res?.data?.index?.length > 0)
    {
      res.data.index
        .reverse()
        .forEach(item => {
          // TODO: 썸네일 데이터라면 다른곳에다 저장한다. 썸네일 기능이 만들어지면 작업할 수 있다.
          fileManager.addFile(convertDataToFileItem(item))
        })
    }
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '첨부파일 목록을 가져오지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.loading = false
  }
})

function onSelect(idx, $event)
{
  fileManager.selectFile(idx, $event)
}
function onClickSpace()
{
  fileManager.selectAllFiles(false)
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
async function deleteFile(key)
{
  try
  {
    const srl = fileManager.items[key]?.srl
    if (!srl) throw new Error('Not found srl.')
    fileManager.removeFile(key)
    await request(`/file/${srl}/`, { method: 'delete' })
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'deleteFile()' ],
      message: '파일을 삭제하지 못했습니다.',
      error: e,
    })
  }
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
      deleteFile(idx).then()
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
      path: [ ...errorPath, 'openWindow' ],
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
      path: [ ...errorPath, 'openWindow' ],
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
      await deleteFile(value)
      break
    case 'upload-file':
      await uploadFile(value)
  }
}
</script>

<style src="./content.scss" lang="scss" scoped></style>
