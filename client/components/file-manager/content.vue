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
  <div v-else-if="fileManager._existItem" class="content-items">
    <ul class="files">
      <li v-for="file in _files">
        <File
          :srl="file.srl"
          :code="file.code"
          :name="file.name"
          :mime="file.mime"
          :size="file.size"
          :path="file.path"
          :selected="file.selected"
          :badge="file.badge"
          :context="[]"/>
      </li>
    </ul>
  </div>
  <Empty v-else title="No file" message="파일이 없습니다." class="empty"/>
</article>
</template>

<script setup>
import { reactive, computed, inject, onMounted, onUnmounted } from 'vue'
import { authStore } from '../../store/auth.js'
import { fileUploader } from '../../libs/file.js'
import { upload } from '../../libs/api.js'
import { request } from '../../libs/api.js'
import { convertDataToFileItem } from './libs.js'
import { ButtonBasic, ButtonGroup } from '../button/index.js'
import { Dropdown, Context } from '../navigation/dropdown/index.js'
import Loading from '../content/loading.vue'
import Empty from '../content/empty.vue'
import File from './file.vue'

const auth = authStore()
const fileManager = inject('file-manager')
const error = inject('error')
const state = reactive({
  loading: false,
})

const _files = computed(() => {
  return fileManager.index
    .map(idx => {
      const item = fileManager.items[idx]
      if (!item) return false
      return {
        ...item,
        selected: false, // TODO
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
    if (!res?.data?.index) throw new Error('Not found data.....')
    if (res.data.index.length > 0)
    {
      res.data.index.forEach(item => fileManager.addFile(convertDataToFileItem(item)))
    }
  }
  catch (e)
  {
    error.catch({
      path: [ 'components', 'file-manager', 'content.vue', 'onMounted' ],
      message: '첨부파일 목록을 가져오지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.loading = false
  }
})

async function uploadFiles()
{
  try
  {
    const files = await fileUploader({
      accept: 'image/*',
      multiple: true,
    })
    // TODO: 업로드 못하도록 막는다.
    await uploadFile(files)
  }
  catch (e)
  {
    error.catch({
      path: [ 'components', 'file-manager', 'content.vue', 'uploadFiles()' ],
      message: '파일 업로드하지 못했습니다.....',
      error: e,
    })
  }
}
function uploadFile(files)
{
  const [ file, ...remainingFiles ] = files
  let idx = undefined
  function nextFile(remainFiles, resolve)
  {
    if (remainFiles.length > 0) uploadFile(remainFiles).then()
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
    if (fileManager._countItems > fileManager.preference.limitCount)
    {
      // TODO: 확인 아직 안되었다.
      console.error('제한된 갯수보다 넘침:', fileManager._countItems, '>', fileManager.preference.limitCount)
      return reject('')
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
      onProgress: progress => {
        if (idx === undefined)
        {
          idx = fileManager.addFile({ progress })
        }
        else
        {
          fileManager.updateFile(idx, { progress })
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

function onClickSelectAll()
{
  // TODO: 모든파일 선택하기
  console.log('onClickSelectAll()')
}

function onClickDelete()
{
  // TODO: 선택된 파일 삭제하기
  console.log('onClickDelete()')
}
</script>

<style src="./content.scss" lang="scss" scoped></style>
