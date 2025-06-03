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
      @keydown.stop=""/>
  </div>
  <div class="input-url__submit">
    <ButtonBasic
      type="submit"
      color="sub"
      size="small"
      icon-left="circle-plus">
      파일 추가하기
    </ButtonBasic>
  </div>
</form>
</template>

<script setup>
import { reactive } from 'vue'
import { ButtonBasic } from '../../button/index.js'
import { FormInput, FormTextarea } from '../../forms/index.js'

const state = reactive({
  url: 'https://',
  processing: false,
})

async function onSubmit()
{
  try
  {
    state.processing = true
    // TODO: forms.url 값 검사하기
    // TODO: 로컬 백엔드로 요청하여 파일 다운로드하고 blob로 응답받기
    // TODO: 파일이름 만들기 (확장자 포함)
    // TODO: 리턴하고 forms.url 값 비우기
    console.log('onSubmit()', state.url)
    state.url = ''
  }
  catch (e)
  {
    // TODO: 오류 처리하기
  }
  finally
  {
    state.processing = false
  }
}
</script>

<style src="./input-url.scss" lang="scss" scoped></style>
