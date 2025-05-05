<template>
<textarea
  ref="$root"
  :name="props.name"
  :id="props.id"
  :value="props.modelValue"
  :required="props.required"
  :disabled="props.disabled"
  :readonly="props.readonly"
  :rows="props.rows"
  :placeholder="props.placeholder"
  autocomplete="off"
  autocorrect="off"
  autocapitalize="off"
  spellcheck="false"
  :class="[
    'textarea',
    props.size && `size--${props.size}`,
    props.error && 'error',
    props.autoSize && 'auto-size',
  ]"
  @input="onChangeText"
  @click="onChangePosition"
  @keyup="onChangePosition"
  @keyup.ctrl.enter.stop="emits('submit')"
  @keydown.meta.enter.stop="emits('submit')"/>
</template>

<script setup>
import { ref } from 'vue'

const $root = ref()
const props = defineProps({
  name: String,
  id: String,
  modelValue: String,
  placeholder: { type: String, default: '키워드를 입력해주세요.' },
  maxlength: Number,
  required: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  rows: { type: Number, default: 4, },
  size: String, // small
  error: Boolean,
  autoSize: Boolean,
})
const emits = defineEmits([ 'update:modelValue', 'position', 'submit' ])

function onChangePosition(e)
{
  if (!('selectionStart' in e.target)) return
  emits('position', {
    start: e.target.selectionStart,
    end: e.target.selectionEnd
  })
}
function onChangeText(e)
{
  emits('update:modelValue', e.target.value)
}

function focus()
{
  $root.value.focus()
}

/**
 * change cursor
 * @param {number} start
 * @param {number} end
 */
function changeCursor(start, end)
{
  $root.value.setSelectionRange(start, end)
}

defineExpose({
  changeCursor,
  focus,
})
</script>

<style src="./textarea.scss" lang="scss" scoped></style>
