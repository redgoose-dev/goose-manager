<template>
<form @submit.prevent="onSubmit">
  <h1 class="content-title">File</h1>
  <div class="json-content">
    <Editor ref="$editor" v-model="forms.json"/>
  </div>
  <Controller>
    <template #left>
      <ButtonBasic
        type="button"
        :disabled="state.processing"
        :icon-left="state.processing ? 'loader' : 'rotate-ccw'"
        :rotate-icon="state.processing"
        @click="onClickReset">
        초기화
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic
        type="submit"
        color="key"
        :disabled="state.processing"
        :icon-left="state.processing ? 'loader' : 'check'"
        :rotate-icon="state.processing">
        업데이트
      </ButtonBasic>
    </template>
  </Controller>
</form>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import Editor from '../../components/pages/json/editor.vue'
import { Controller } from '../../components/navigation/index.js'
import { ButtonBasic } from '../../components/button/index.js'

const keyName = 'file'
const preference = inject('preference')
const error = inject('error')
const errorPath = [ 'pages', 'preference', 'basic.vue' ]
const toast = inject('toast')
const $editor = ref()
const state = reactive({
  processing: false,
})
const forms = reactive({
  json: JSON.stringify(preference._pure[keyName]),
})

async function onSubmit()
{
  try
  {
    state.processing = true
    await preference.update(keyName, JSON.parse(forms.json))
    toast.add('설정 업데이트 완료', 'success').then()
  }
  catch(e)
  {
    error.catch({
      path: [ ...errorPath, 'onSubmit()' ],
      message: '설정을 업데이트 실패',
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}

async function onClickReset()
{
  try
  {
    state.processing = true
    const res = await preference.getDefault(keyName)
    forms.json = JSON.stringify(res, null, 2)
    if ($editor.value?.$editor)
    {
      $editor.value.$editor.updateData(forms.json, true)
    }
  }
  catch(e)
  {
    error.catch({
      path: [ ...errorPath, 'onClickReset()' ],
      message: '설정을 초기화하지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}
</script>

<style src="./content.scss" lang="scss" scoped></style>
