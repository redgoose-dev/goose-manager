<template>
<Items theme="thumbnail" class="files-index">
  <Thumbnail
    v-for="item in props.items"
    :href="item.href"
    target="_blank"
    :image="item.image"
    thumbnail-type="contain"
    :title="item.title"
    :alt="item.title"
    :meta="item.meta"
    :json="item.json"
    :use-thumbnail="item.useThumbnail"
    :nav="[
      !!item.image && { label: '리사이즈 이미지', click: () => openResizeImage(item.path) },
    ].filter(Boolean)"/>
</Items>
<teleport to="#modals">
  <Modal :show="resizeImage.visible" @close="closeResizeImage">
    <ModalBody type="window" style="padding: 30px">
      <ResizeWindow :path="resizeImage.path" @close="closeResizeImage"/>
    </ModalBody>
  </Modal>
</teleport>
</template>

<script setup>
import { reactive } from 'vue'
import { Modal, ModalBody } from '../../modal'
import { Items, Thumbnail } from '../../item'
import ResizeWindow from './assets/resize-window.vue'

const props = defineProps({
  items: Array,
})
const resizeImage = reactive({
  visible: false,
  path: undefined,
})

function openResizeImage(path)
{
  if (!path) return
  resizeImage.visible = true
  resizeImage.path = path
}
function closeResizeImage()
{
  resizeImage.visible = false
  resizeImage.path = undefined
}
</script>

<style scoped>
.files-index {
  --item-img-ratio: 1/1;
}
</style>
