<template>
<Modal
  :open="!!props.content"
  :shortcut="true"
  class="preview-modal"
  @close="emits('close')">
  <ModalWindow tag="article" :scroll="false" class="preview">
    <header class="preview__header">
      <h1>{{props.title}}</h1>
      <nav>
        <ButtonIcon
          color="transparent"
          icon-name="x"
          @click="emits('close')">
          닫기
        </ButtonIcon>
      </nav>
    </header>
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
import { Modal, ModalWindow } from '../modal/index.js'
import { ButtonIcon } from '../button/index.js'

const props = defineProps({
  title: { type: String, default: '미리보기' },
  content: String,
})
const emits = defineEmits([ 'close' ])
</script>

<style src="./preview.scss" lang="scss" scoped></style>
