<template>
<Modal
  :show="props.show"
  :scroll="true"
  class="preview"
  @close="emits('close')">
  <ModalBody type="window" class="preview__body">
    <div
      v-html="props.content"
      class="preview__content redgoose-body redgoose-body--dark redgoose-body--popup"/>
  </ModalBody>
</Modal>
</template>

<script setup>
import { Modal, ModalBody } from '../modal'

const props = defineProps({
  show: Boolean,
  content: String,
})
const emits = defineEmits([ 'close' ])
</script>

<style src="./preview.scss" lang="scss" scoped></style>
