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
  :class="[
    'textarea',
    props.size && `textarea--size-${props.size}`,
    props.error && 'textarea--error',
  ]"
  @input="onChangeText"
  @click="onChangePosition"
  @keyup="onChangePosition"
  @keyup.ctrl.enter.stop="emits('submit')"
  @keydown.meta.enter.stop="emits('submit')"/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { printf } from '../../libs/string'
import { message } from '../../message'

const $root = ref()
const props = defineProps({
  name: String,
  id: String,
  modelValue: String,
  placeholder: {
    type: String,
    default: printf(message.words.pleaseInput, message.word.keyword),
  },
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

onMounted(() => {
  if (props.autoSize) changeHeight()
})

defineExpose({
  changeHeight,
  changeCursor,
  focus,
})

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
  if (props.autoSize) changeHeight()
  emits('update:modelValue', e.target.value)
}

function changeHeight()
{
  const { style } = $root.value
  style.setProperty('--textarea-height', `auto`)
  style.setProperty('--textarea-height', `${$root.value.scrollHeight}px`)
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
</script>

<style src="./form-textarea.scss" lang="scss" scoped></style>
