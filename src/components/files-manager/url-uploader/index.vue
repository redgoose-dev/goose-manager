<template>
<article class="upload-url">
  <div class="upload-url__wrap">
    <header class="upload-url__header">
      <h3>{{message.header.uploadFilesUrl}}</h3>
      <p>
        URL 주소로 파일을 업로드할 수 있습니다.<br/>
        텍스트 입력창에 주소를 입력하고 "검사하기" 버튼을 눌러서 올바른 파일인지 검사하고 업로드 버튼을 누릅니다.
      </p>
    </header>
    <Items
      :src="verifyItems"
      @remove-item="removeVerifyItem"
      @update-item="updateVerifyItem"/>
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
        color="sub"
        icon-left="link-2"
        @click="openAddUrl">
        URL 추가하기
      </ButtonBasic>
      <ButtonBasic
        color="key"
        icon-left="upload"
        :disabled="disabledSubmitButton"
        @click="submitUpload">
        파일 업로드
      </ButtonBasic>
    </template>
  </Controller>
</article>
<teleport to="#modals">
  <Modal :show="windowAddUrl" @close="windowAddUrl = false">
    <ModalBody type="window">
      <InputUrl
        @submit="onSubmitInputUrl"
        @close="windowAddUrl = false"/>
    </ModalBody>
  </Modal>
</teleport>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { VerifyItem } from './types'
import { message } from '../../../message'
import { pureObject } from '../../../libs/object'
import { controlWindow } from '../util'
import { ButtonBasic } from '../../button'
import { Controller } from '../../navigation'
import Items from './items.vue'
import { Modal, ModalBody } from '../../modal'
import InputUrl from './input-url.vue'

const emits = defineEmits([ 'close', 'submit' ])
const processingSub = ref<boolean>(false)
const verifyItems = ref<VerifyItem[]>([])
const windowAddUrl = ref<boolean>(false)
const disabledSubmitButton = computed<boolean>(() => {
  return !(verifyItems.value.length > 0)
})

onMounted(() => {
  controlWindow(true, 'url-uploader')
})
onUnmounted(() => {
  controlWindow(false, 'url-uploader')
})

function openAddUrl()
{
  windowAddUrl.value = true
}

function onSubmitInputUrl(items: VerifyItem[]): void
{
  verifyItems.value = [
    ...verifyItems.value,
    ...items,
  ]
  windowAddUrl.value = false
}

function updateVerifyItem(idx: number, item: VerifyItem): void
{
  verifyItems.value = Object.assign([], verifyItems.value, { [idx]: item })
}
function removeVerifyItem(idx: number): void
{
  verifyItems.value.splice(idx, 1)
}

async function submitUpload(): Promise<void>
{
  let uploadItems: File[] = []
  verifyItems.value.forEach((o,k) => {
    let file = new File([o.blob], o.name, {
      type: o.type,
      lastModified: o.date.getTime(),
    })
    uploadItems.push(file)
  })
  emits('submit', uploadItems)
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
