<template>
<component
  ref="$root"
  :is="tag"
  :contenteditable="!disabled"
  class="content-editable"
  @input="emits('update:modelValue', $event.target.innerText)"
  @blur="emits('update:modelValue', $event.target.innerText)"
  @paste="onPasteText"
  @keydown.meta.enter="emits('submit')"
  @keyup.ctrl.enter="emits('submit')"/>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const $root = ref();
const props = defineProps({
  tag: { type: String, default: 'div' },
  modelValue: String,
  disabled: Boolean,
});
const emits = defineEmits([ 'submit', 'update:modelValue' ]);

onMounted(() => {
  $root.value.innerText = props.modelValue;
});
watch(() => props.modelValue, text => {
  if (text !== $root.innerText) $root.innerText = text;
});

function onPasteText(e)
{
  e.preventDefault();
  if (!window) return;
  let text = (e.originalEvent || e).clipboardData.getData('text/plain');
  document.execCommand('insertText', false, text);
}
</script>

<style lang="scss" scoped>
.content-editable {
  box-sizing: border-box;
}
.content-editable[contenteditable=false] {
  cursor: not-allowed;
}
</style>
