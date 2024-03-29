<template>
<form
  ref="$formInputUrl"
  class="input-url"
  @submit.prevent="onSubmit">
  <fieldset>
    <legend class="input-url__title">URL 주소 입력</legend>
    <p class="input-url__description">
      파일 URL을 입력하여 파일들을 업로드할 수 있습니다.
    </p>
    <FormTextarea
      v-model="address"
      name="address"
      placeholder="https://example.com/example-image.jpg"
      :required="true"
      :rows="15"
      class="input-url__text-input"
      @submit="onSubmit"/>
    <Help>파일 여러개를 업로드 하려면 줄바꿈을 이용하여 주소를 입력합니다.</Help>
  </fieldset>
  <nav class="input-url__nav">
    <div>
      <ButtonBasic
        type="button"
        icon-left="x"
        @click="emits('close')">
        닫기
      </ButtonBasic>
    </div>
    <div>
      <ButtonBasic
        type="submit"
        color="key"
        :icon-left="processingVerify ? 'loader' : 'plus-circle'"
        :rotate-icon="processingVerify"
        :disabled="disabledSubmitButton">
        파일 추가하기
      </ButtonBasic>
    </div>
  </nav>
</form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ofetch } from 'ofetch'
import { toast } from '../../../modules/toast'
import { getPath } from '../../../libs/string'
import { FormTextarea } from '../../forms'
import { ButtonBasic } from '../../button'
import { Help } from '../../forms/fieldset'

const { VITE_BASE_URL } = import.meta.env
const emits = defineEmits([ 'submit', 'close' ])
const address = ref(``)
const processingVerify = ref(false)
const disabledSubmitButton = computed(() => {
  if (processingVerify.value) return true
  if (!(address.value.length > 2)) return true
  return false
})

async function onSubmit()
{
  if (!address.value) return
  let verifyItems = []
  const addressIndex = address.value.split('\n').filter((o) => (!!o))
  processingVerify.value = true
  let res = await Promise.all(addressIndex.map((o) => uploadImageUrl(o)))
  res = res.filter(Boolean)
  processingVerify.value = false
  if (res.length > 0)
  {
    verifyItems = res
    emits('submit', verifyItems)
  }
  else
  {
    toast.add('등록할 수 있는 파일이 없습니다.', 'error').then()
  }
}

async function uploadImageUrl(path)
{
  if (!path) return false
  try
  {
    const url = new URL(path)
    if (!url.host) throw new Error('invalid url')
    if (!/^http(s)/.test(url.protocol)) throw new Error(`invalid url`)
    let blob = await ofetch(getPath(`${VITE_BASE_URL}/local/download/`), {
      method: 'post',
      responseType: 'blob',
      retry: 0,
      body: { path },
    })
    let filename = url.pathname.substring(url.pathname.lastIndexOf('/') + 1)
    if (!filename.includes('.'))
    {
      filename += `.${blob.type.split('/')[1]}`
    }
    return {
      blob,
      name: filename,
      type: blob.type,
      date: new Date(),
    }
  }
  catch (e)
  {
    return false
  }
}
</script>

<style src="./input-url.scss" lang="scss" scoped></style>
