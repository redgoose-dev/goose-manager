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
      :rows="12"
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

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ofetch } from 'ofetch'
import { toast } from '../../../modules/toast'
import { FormTextarea } from '../../forms'
import { ButtonBasic } from '../../button'
import { Help } from '../../forms/fieldset'
import { VerifyItem } from './types'

// TODO: 나중에 값 비우기
const mockupUrl = 'https://goose.redgoose.me/data/upload/original/202211/infra-structure.webp\n' +
  'https://goose.redgoose.me/data/upload/original/202301/eye-test-001.jpg\n' +
  'https://goose.redgoose.me/data/upload/original/202205/scan-works-008.webp\n' +
  'https://goose.redgoose.me/data/upload/original/202003/the-war-of-genesis-3-002.jpg\n' +
  'https://api.goose.me/data/upload/original/201906/motor_example_1xc4d.zip'
const emits = defineEmits([ 'submit', 'close' ])
const address = ref<string>(mockupUrl)
const processingVerify = ref(false)
const disabledSubmitButton = computed<boolean>(() => {
  if (processingVerify.value) return true
  if (!(address.value.length > 2)) return true
  return false
})

async function onSubmit(): Promise<void>
{
  if (!address.value) return
  let verifyItems: Awaited<VerifyItem | boolean>[] = []
  const addressIndex = address.value.split('\n').filter((o: string) => (!!o))
  processingVerify.value = true
  let res = await Promise.all(addressIndex.map((o: string) => uploadImageUrl(o)))
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

async function uploadImageUrl(path: string): Promise<VerifyItem|boolean>
{
  if (!path) return false
  try
  {
    const url = new URL(path)
    if (!url.host) throw new Error('invalid url')
    if (!/^http(s)/.test(url.protocol)) throw new Error(`invalid url`)
    let blob = await ofetch(url.href, {
      responseType: 'blob',
    })
    return {
      blob,
      name: url.pathname.substring(url.pathname.lastIndexOf('/') + 1),
      type: blob.type,
      date: new Date(),
    }
  }
  catch (e: any)
  {
    return false
  }
}
</script>

<style src="./input-url.scss" lang="scss" scoped></style>
