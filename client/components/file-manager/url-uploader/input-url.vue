<template>
<form class="input-url" @submit.prevent="onSubmit">
  <p class="input-url__label">
    <label for="url">파일 URL</label>
  </p>
  <div class="input-url__text">
    <FormInput
      name="url"
      id="url"
      type="url"
      v-model="state.url"
      size="small"
      @keydown.stop/>
  </div>
  <div class="input-url__submit">
    <ButtonBasic
      type="submit"
      color="sub"
      size="small"
      :icon-left="state.processing ? 'loader' : 'circle-plus'"
      :rotate-icon="state.processing"
      :disabled="state.processing">
      {{state.processing ? '처리중...' : '파일 가져오기'}}
    </ButtonBasic>
  </div>
</form>
</template>

<script setup>
import { reactive, inject } from 'vue'
import { localRequest } from '../../../libs/api.js'
import { ButtonBasic } from '../../button/index.js'
import { FormInput } from '../../forms/index.js'
import { createRandomText } from "../../../libs/strings.js";

const error = inject('error')
const emits = defineEmits([ 'submit' ])
const state = reactive({
  url: '',
  processing: false,
})

async function onSubmit()
{
  try
  {
    state.processing = true
    // validate url
    if (!state.url) throw new Error('URL is required')
    const url = new URL(state.url)
    if (!url.host) throw new Error('Invalid URL')
    if (!/^http(s)/.test(url.protocol)) throw new Error('Invalid URL')
    // get file data
    const blob = await localRequest({
      url: '/zone/download/',
      method: 'post',
      responseType: 'blob',
      body: { url: state.url },
    })
    if (!blob) throw new Error('Failed to download file from URL')
    // convert blob to file
    let filename = url.pathname?.split('/').pop().split('.')[0] || `${Date.now()}-${createRandomText(4)}`
    filename = filename.replace(/[<>:"/\\|?*]+/g, '_')
    const ext = blob.type.split('/')[1]
    // emit file
    emits('submit', {
      blob,
      name: `${filename}.${ext}`,
      date: new Date(),
    })
    state.url = ''
  }
  catch (e)
  {
    error.catch({
      path: [ 'components', 'file-manager', 'url-uploader', 'input-url.vue', 'onSubmit()' ],
      message: '파일을 가져오지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}
</script>

<style src="./input-url.scss" lang="scss" scoped></style>
