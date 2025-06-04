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
    @submit="addFile"/>
  <div class="url-uploader__items">
    <Items
      v-if="items?.length > 0"
      :items="items"
      @update-item="updateItem"
      @remove-item="removeItem"/>
    <Empty
      v-else
      icon="circle-slash"
      title="가져온 파일이 없습니다."
      class="empty"/>
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
import { ref, computed } from 'vue'
import { blobToFile } from '../../../libs/file.js'
import Items from './items.vue'
import InputUrl from './input-url.vue'
import Controller from '../../navigation/controller.vue'
import { ButtonBasic } from '../../button/index.js'
import Empty from '../../content/empty.vue'

const emits = defineEmits([ 'submit', 'close' ])
const items = ref([])

const _disabledSubmitButton = computed(() => (!(items.value.length > 0)))

function addFile(item)
{
  items.value.push(item)
}
function updateItem(idx, item)
{
  items.value = Object.assign([], items.value, { [idx]: item })
}
function removeItem(idx)
{
  items.value.splice(idx, 1)
}

function onSubmit()
{
  const files = items.value.map(item => {
    return blobToFile(item.blob, item.name, {
      type: item.blob.type,
      lastModified: item.date.getTime(),
    })
  })
  emits('submit', files)
  emits('close')
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
