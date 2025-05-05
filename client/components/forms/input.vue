<template>
<input
  ref="$root"
  :type="props.type"
  :name="props.name"
  :id="props.id"
  :value="props.modelValue"
  :required="props.required"
  :disabled="props.disabled"
  :readonly="props.readonly"
  :placeholder="props.placeholder"
  :maxlength="props.maxlength"
  :min="props.min"
  :max="props.max"
  :step="props.step"
  :pattern="props.pattern"
  :class="[
    'input',
    props.size && `size--${props.size}`,
    props.error && 'error',
  ]"
  @input="onChangeText"
  @click="onChangePosition"
  @keyup="onChangePosition"
  @keyup.enter="emits('submit')"
  @keydown.enter="emits('submit')"/>
</template>

<script setup>
import { ref } from 'vue'

const $root = ref()
const props = defineProps({
  type: { type: String, default: 'text' }, // text,number,date,time
  name: String,
  id: String,
  modelValue: [ String, Number ],
  placeholder: { type: String, default: '키워드를 입력해주세요.' },
  maxlength: Number,
  required: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  step: Number,
  min: Number,
  max: Number,
  size: String, // small
  error: Boolean,
  pattern: String,
})
const emits = defineEmits([ 'update:modelValue', 'position', 'submit', 'click' ])

defineExpose({
  focus,
})

function onChangePosition(e)
{
  if (!('selectionStart' in e.target)) return
  emits('position', {
    start: e.target.selectionStart,
    end: e.target.selectionEnd
  })
  emits('click', e)
}
function onChangeText(e)
{
  let value = e.target.value
  switch (props.type)
  {
    case 'number':
      value = Number(value)
      break
  }
  emits('update:modelValue', value)
}

function focus()
{
  $root.value.focus()
}
</script>

<style src="./input.scss" lang="scss" scoped></style>
