<template>
<article class="content">
  <header class="head">
    <nav class="head__controller">
      <ButtonGroup>
        <Dropdown mode="hover" class="upload">
          <template #trigger>
            <ButtonBasic
              size="small"
              color="key"
              icon-left="upload"
              class="button-upload"
              @click="onClickUpload('upload-file')">
              업로드
            </ButtonBasic>
          </template>
          <Context
            :items="[
              { key: 'upload-file', label: '파일 업로드', iconLeft: 'upload' },
              { key: 'upload-url', label: 'URL 업로드', iconLeft: 'link' },
            ]"
            @select="(e) => onClickUpload(e.key)"/>
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
      </ButtonGroup>
    </nav>
    <p class="head__info">
      업로드: <em>{{fileManager._countItems}} / {{fileManager.preference.limitCount}}</em>
    </p>
  </header>
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
import { fileUploader } from '../../libs/file.js'
import { upload } from '../../libs/api.js'
import { request } from '../../libs/api.js'
import { convertDataToFileItem } from './libs.js'
import { printf } from '../../libs/strings.js'
import { sleep } from '../../libs/util.js'
import { fileContextKey } from './assets.js'
import { ButtonBasic, ButtonGroup } from '../button/index.js'
import { Dropdown, Context } from '../navigation/dropdown/index.js'
import Loading from '../content/loading.vue'
import Empty from '../content/empty.vue'
import { File, Progress } from './item/index.js'

const fileManager = inject('file-manager')
const fileManagerEvent = inject('file-manager-event')
const error = inject('error')
const auth = authStore()
const state = reactive({
  loading: false,
})
const errorPath = [ 'components', 'file-manager', 'content.vue' ]

const _files = computed(() => {
  return fileManager.index
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
    .filter(Boolean)
})

onMounted(async () => {
  try
  {
    state.loading = true
    const { module, moduleSrl } = fileManager.preference
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
        .forEach(item => fileManager.addFile(convertDataToFileItem(item)))
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

function onClickUpload(key)
{
  switch (key)
  {
    case 'upload-file':
      uploadFiles().then()
      break
    case 'upload-url':
      // TODO: URL 업로드 창 열기
      break
  }
}
async function uploadFiles()
{
  try
  {
    const files = await fileUploader({
      accept: fileManager.preference.acceptFileType,
      multiple: true,
    })
    await uploadFile(files)
  }
  catch (e)
  {
    errorUploadFile([ 'uploadFiles()' ], e)
  }
}
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
          .catch(e => errorUploadFile([ 'uploadFile()' ], e))
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
function errorUploadFile(path, err)
{
  error.catch({
    path: [ ...errorPath, ...path ],
    message: typeof err === 'string' ? err : '파일 업로드 실패',
    error: typeof err === 'string' ? new Error(err) : err,
  })
}

function onSelect(idx, $event)
{
  fileManager.selectFile(idx, $event)
}
function onClickSelectAll()
{
  fileManager.selectAllFiles()
}
function onClickSpace()
{
  fileManager.selectAllFiles(false)
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
    await deleteFile(key)
    await sleep(1000)
  }
}
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
  console.log('onSelectContextItem()', idx, code)
  switch (code)
  {
    case fileContextKey.OPEN_NEW_WINDOW:
      break
    case fileContextKey.DOWNLOAD:
      break
    case fileContextKey.SET_THUMBNAIL:
      break
    case fileContextKey.INSERT_MARKDOWN:
      break
    case fileContextKey.INSERT_ADDRESS:
      break
    case fileContextKey.INSERT_HTML:
      break
    case fileContextKey.DELETE:
      if (!confirm('선택한 파일을 삭제할까요? 삭제하면 복구할 수 없습니다.')) return
      await deleteFile(idx)
      break
  }
  // console.log('onSelectContextItem()', item)
  // fileManagerEvent.
}
</script>

<style src="./content.scss" lang="scss" scoped></style>
