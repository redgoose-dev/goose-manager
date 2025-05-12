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
    <pre>{{fileManager.items}}</pre>
    <pre>{{fileManager.index}}</pre>
    <Files
      :files="_files"
      :progress="10"/>
  </div>
  <Empty v-else title="No file" message="파일이 없습니다." class="empty"/>
</article>
</template>

<script setup>
import { reactive, computed, inject, onMounted } from 'vue'
import { ButtonBasic, ButtonGroup } from '../button/index.js'
import { Dropdown, Context } from '../navigation/dropdown/index.js'
import { fileUploader } from '../../libs/file.js'
import { upload } from '../../libs/api.js'
import Loading from '../content/loading.vue'
import Empty from '../content/empty.vue'
import Files from './files.vue'

// TODO: 현재까지는 파일 업로드 요청하고 응답받는데까지 끝냈다.
// TODO: API 인증관련해서 다른부분부터 작업하는게 좋겠다.
// TODO: 인증처리 부분 끝내고나서

const fileManager = inject('file-manager')
const state = reactive({
  loading: false,
})

const _files = computed(() => {
  // TODO: 목록 순서대로 가져오고 선택되어있는지도 체킹하기
  return fileManager.index
    .map(idx => {
      const item = fileManager.items[idx]
      if (!item) return false
      return {
        ...item,
      }
    })
    .filter(Boolean)
})

onMounted(async () => {
  try
  {
    state.loading = true
    // TODO: 데이터 불러오기
    // TODO: 불러온 데이터 스토어에 넣기
  }
  catch (e)
  {
    // TODO: 오류처리
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
    // TODO: 오류처리
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
      return reject()
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
          fileManager.updateFile(idx, res.data)
          nextFile(remainingFiles, resolve)
        }
        else
        {
          fileManager.removeFile(idx)
          reject('Not found file data')
        }
      },
      onError: (error) => {
        console.error('onError()', error)
        // TODO: 막아놨던 업로드 버튼을 풀어준다.
        reject()
      },
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
