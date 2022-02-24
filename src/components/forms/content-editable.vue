<template>
<component
  ref="$root"
  :is="tag"
  :contenteditable="!disabled"
  :data-placeholder="props.placeholder"
  :class="[
    'content-editable',
    props.modelValue.length <= 0 && 'content-editable--placeholder',
  ]"
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
  placeholder: String,
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
  cursor: text;
  &[contenteditable=false] {
    cursor: not-allowed;
  }
  &--placeholder {
    color: rgb(var(--color-base-rgb) / 50%);
    &:before {
      content: attr(data-placeholder);
    }
  }
}
</style>
