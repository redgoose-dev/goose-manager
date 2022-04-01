<template>
<Modal
  :show="props.show"
  :scroll="true"
  class="preview"
  @close="emits('close')">
  <Body type="window" class="preview__body">
    <div
      ref="$preview"
      v-html="props.content"
      class="preview__content redgoose-body redgoose-body--dark redgoose-body--popup"/>
  </Body>
</Modal>
</template>

<script setup>
import { ref } from 'vue';
import { Modal, Body } from '../modal';

const props = defineProps({
  show: Boolean,
  content: String,
});
const emits = defineEmits([ 'close' ]);
</script>

<style src="./preview.scss" lang="scss" scoped></style>
