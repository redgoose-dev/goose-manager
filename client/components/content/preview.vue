<template>
<Modal
  :open="!!props.content"
  :shortcut="true"
  class="preview-modal"
  @close="emits('close')">
  <ModalWindow tag="article" :scroll="false" class="preview">
    <ModalHeader :title="props.title" @close="emits('close')"/>
    <div
      v-html="props.content"
      :class="[
        'redgoose-body',
        'redgoose-body--popup',
        'preview__content',
      ]"/>
  </ModalWindow>
</Modal>
</template>

<script setup>
import { Modal, ModalWindow, ModalHeader } from '../modal/index.js'

const props = defineProps({
  title: { type: String, default: '미리보기' },
  content: String,
})
const emits = defineEmits([ 'close' ])
</script>

<style src="./preview.scss" lang="scss" scoped></style>
