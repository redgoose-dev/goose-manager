<template>
<article class="upload-url">
  <div class="upload-url__wrap">
    <header class="upload-url__header">
      <h3>URL 주소로 파일 업로드</h3>
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
        닫기
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonGroup>
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
      </ButtonGroup>
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

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { controlWindow } from '../util'
import { fileManagerStore } from '../store'
import { ButtonBasic, ButtonGroup } from '../../button'
import { Controller } from '../../navigation'
import Items from './items.vue'
import { Modal, ModalBody } from '../../modal'
import InputUrl from './input-url.vue'

const emits = defineEmits([ 'close', 'submit' ])
const localStore = fileManagerStore()
const verifyItems = ref([])
const windowAddUrl = ref(false)
const disabledSubmitButton = computed(() => {
  return !(verifyItems.value.length > 0)
})

onMounted(() => {
  localStore.useShortcut = false
  controlWindow(true, 'url-uploader')
})
onUnmounted(() => {
  localStore.useShortcut = true
  controlWindow(false, 'url-uploader')
})

function openAddUrl()
{
  windowAddUrl.value = true
}

function onSubmitInputUrl(items)
{
  verifyItems.value = [
    ...verifyItems.value,
    ...items,
  ]
  windowAddUrl.value = false
}

function updateVerifyItem(idx, item)
{
  verifyItems.value = Object.assign([], verifyItems.value, { [idx]: item })
}
function removeVerifyItem(idx)
{
  verifyItems.value.splice(idx, 1)
}

async function submitUpload()
{
  let uploadItems = []
  verifyItems.value.forEach((o,k) => {
    let name = o.name.replace(/\n/g, '')
    name = name.replace(/[<>:"/\\|?*]+/g, '_')
    let file = new File([o.blob], name, {
      type: o.type,
      lastModified: o.date.getTime(),
    })
    uploadItems.push(file)
  })
  emits('submit', uploadItems)
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
