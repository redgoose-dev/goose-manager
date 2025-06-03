<template>
<article class="url-uploader">
  <header class="url-uploader__header">
    <h1>URL 주소로 파일 업로드</h1>
    <p>
      URL 주소로 파일을 업로드할 수 있습니다.<br/>
      텍스트 입력창에 주소를 입력하고 "파일 추가하기" 버튼을 눌러서 파일을 가져옵니다.
    </p>
  </header>
  <InputUrl
    class="url-uploader__input-url"
    @submit=""/>
  <div class="url-uploader__items">
    <Items/>
  </div>
  <Controller class="url-uploader__submit">
    <template #left>
      <ButtonBasic
        icon-left="x"
        @click="emits('close')">
        닫기
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic
        icon-left="upload"
        color="key"
        @click="onSubmit">
        파일 업로드
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { reactive } from 'vue'
import Items from './items.vue'
import InputUrl from './input-url.vue'
import Controller from '../../navigation/controller.vue'
import { ButtonBasic } from '../../button/index.js'

const emits = defineEmits([ 'submit', 'close' ])

function onSubmit()
{
  console.log('onSubmit()')
  emits('submit')
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
