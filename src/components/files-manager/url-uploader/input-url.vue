<template>
<form
  ref="$formInputUrl"
  class="input-url"
  @submit.prevent="onSubmit">
  <fieldset>
    <legend class="input-url__title">URL 주소 입력</legend>
    <div class="field">
      <FormInput
        v-model="address"
        name="address"
        placeholder="https://example.com/example-image.jpg"
        :required="true"
        size="small"/>
      <ButtonBasic
        type="submit"
        color="key"
        size="small"
        :icon-left="processingVerify ? 'loader' : 'plus-circle'"
        :rotate-icon="processingVerify"
        :disabled="disabledSubmitButton">
        파일 추가하기
      </ButtonBasic>
    </div>
  </fieldset>
</form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ofetch } from 'ofetch'
import { toast } from '../../../modules/toast'
import { getPath } from '../../../libs/string'
import { FormInput } from '../../forms'
import { ButtonBasic } from '../../button'

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
    address.value = ''
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
