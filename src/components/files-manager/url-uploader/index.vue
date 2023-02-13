<template>
<article ref="$root" class="upload-url">
  <div class="upload-url__wrap">
    <header class="upload-url__header">
      <h3>{{message.header.uploadFilesUrl}}</h3>
      <p>
        URL 주소로 파일을 업로드할 수 있습니다.<br/>
        텍스트 입력창에 주소를 입력하고 "검사하기" 버튼을 눌러서 올바른 파일인지 검사하고 업로드 버튼을 누릅니다.
      </p>
    </header>
    <Tab
      v-model="tab"
      class="upload-url__tab"/>
    <component
      v-if="tab === 'verify'"
      :is="bodyComponent"/>
    <form
      v-else
      ref="$formInputUrl"
      class="upload-url__form-input-url"
      @submit.prevent="submitInputUrl">
      <component
        :is="bodyComponent"
        @submit="submitInputUrlInComponent"/>
      <button type="submit">submit</button>
    </form>
  </div>
  <Controller class="upload-url__submit">
    <template #left>
      <ButtonBasic
        type="button"
        icon-left="x"
        @click="$emit('close')">
        {{message.word.close}}
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic
        type="submit"
        color="sub"
        :icon-left="processingVerify ? 'loader' : 'check-circle'"
        :rotate-icon="processingVerify"
        :disabled="processingVerify"
        @click="submitInputUrlInComponent">
        검증하기
      </ButtonBasic>
      <ButtonBasic
        color="key"
        icon-left="upload"
        :disabled="true"
        @click="submitUpload">
        파일 업로드
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script lang="ts" setup>
import { ref, computed, defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import { ofetch } from 'ofetch'
import { message } from '../../../message'
import { controlWindow } from '../util'
import { ButtonBasic } from '../../button'
import Tab from './tab.vue'
import { Controller } from '../../navigation'

const $root = ref()
const $formInputUrl = ref()
const emits = defineEmits([ 'close', 'submit' ])
const tab = ref<string>('')
const processingVerify = ref(false)
const processingSub = ref<boolean>(false)
const bodyComponent = computed<any>(() => {
  switch (tab.value) {
    case 'verify':
      return defineAsyncComponent(() => import('./check-verify.vue'))
    default:
      return defineAsyncComponent(() => import('./input-url.vue'))
  }
})

function submitInputUrlInComponent(): void
{
  if (!$formInputUrl.value) return
  const $button = $formInputUrl.value.querySelector('button[type=submit]')
  $button.click()
}
async function submitInputUrl(): Promise<void>
{
  if (!$formInputUrl.value) return
  const $address = $formInputUrl.value.address
  const address = $address.value
  const addressIndex = address.split('\n')
  try
  {
    processingVerify.value = true
    let res = await Promise.all(addressIndex.map((o: string) => uploadImageUrl(o)))
    res = res.filter(Boolean)
    // console.log(res)
    processingVerify.value = false
    // TODO: 입력한 URL들을 검사해보고 파일 형식으로 가져온게 완료되면 verify 탭으로 이동한다.
  }
  catch (e)
  {
    //
  }
  finally
  {
    processingVerify.value = false
    // tab.value = 'verify'
  }
}

async function uploadImageUrl(path: string): Promise<any>
{
  if (!path) return false
  try
  {
    const url = new URL(path)
    if (!url.host) throw new Error('invalid url')
    if (!/^http(s)/.test(url.protocol)) throw new Error(`invalid url`)
    const res = await ofetch(url.href, {
      responseType: 'blob',
    })
    console.log(res)
    return {}
  }
  catch (e: any)
  {
    console.log(e)
    // console.error(e.message)
    return false
  }
}

async function submitUpload(): Promise<void>
{
  console.log('submitUploadFiles()')
  emits('submit')
}

onMounted(() => {
  controlWindow(true, 'url-uploader')
})
onUnmounted(() => {
  controlWindow(false, 'url-uploader')
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
