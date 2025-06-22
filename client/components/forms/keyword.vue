<template>
<div
  :class="[
    'keyword',
    _disabled && `disabled`,
    props.size && `size--${props.size}`,
  ]">
  <p class="body">
    <input
      ref="$input"
      :type="props.type"
      :name="props.name"
      :id="props.id"
      :list="props.list"
      :value="props.modelValue"
      :required="props.required"
      :disabled="_disabled"
      :readonly="props.readonly"
      :maxlength="props.maxlength"
      :minlength="props.minlength"
      :placeholder="props.placeholder"
      :autocomplete="props.autocomplete ? 'on' : 'off'"
      @input="$emit('update:modelValue', $event.target.value)"
      @click="$emit('click-input', $event)"
      @keydown.enter.prevent="$emit('submit', props.modelValue)"/>
  </p>
  <button
    v-if="props.useSubmit"
    type="button"
    :disabled="props.processing"
    :class="[
      'submit',
      props.processing && 'processing',
    ]"
    @click="$emit('submit', props.modelValue)">
    <Icon v-if="props.processing" name="loader" animation="spin"/>
    <Icon v-else :name="props.iconSubmit"/>
  </button>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Icon from '../icon/index.vue'

const $input = ref()
const props = defineProps({
  type: { type: String, default: 'search' },
  name: String,
  id: String,
  list: String,
  modelValue: String,
  required: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  minlength: Number,
  maxlength: Number,
  size: String, // small
  placeholder: { type: String, default: '키워드를 입력해주세요.' },
  autocomplete: Boolean,
  processing: Boolean,
  useSubmit: Boolean,
  iconSubmit: { type: String, default: 'search' },
})
const emits = defineEmits([ 'update:modelValue', 'submit', 'click-input' ])
const _disabled = computed(() => {
  return props.disabled || props.processing
})

defineExpose({
  $input,
})
</script>

<style src="./keyword.scss" lang="scss" scoped></style>
