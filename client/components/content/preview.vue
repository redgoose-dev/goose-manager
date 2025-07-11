<template>
<Modal
  :open="!!props.content"
  :shortcut="true"
  class="preview-modal"
  @close="emits('close')">
  <ModalWindow tag="article" :scroll="false" class="preview">
    <ModalHeader :title="props.title" @close="emits('close')"/>
    <div
      v-html="content"
      :class="[
        'redgoose-body',
        'redgoose-body--popup',
        'preview__content',
      ]"/>
  </ModalWindow>
</Modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { marked } from 'marked'
import { defaultOptions, baseRenderer, checklistRenderer, renderContent } from '../../modules/marked.js'
import { Modal, ModalWindow, ModalHeader } from '../modal/index.js'

const props = defineProps({
  title: { type: String, default: '미리보기' },
  content: String,
  private: Boolean,
})
const emits = defineEmits([ 'close' ])
const content = ref('')

watch(() => props.content, (value) => {
  if (!value) return
  let renderer = baseRenderer()
  renderer = checklistRenderer(renderer, true)
  const str = renderContent(props.content, props.private)
  content.value = marked.parse(str, {
    ...defaultOptions,
    renderer,
  })
})
</script>

<style src="./preview.scss" lang="scss" scoped></style>
