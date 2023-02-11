<template>
<div :class="[
  'keyword-text',
  props.disabled && `keyword-text--disabled`,
  props.size && `keyword-text--size-${props.size}`,
]">
  <p class="keyword-text__input">
    <input
      ref="$input"
      :type="props.type"
      :name="props.name"
      :id="props.id"
      :value="props.modelValue"
      :required="props.required"
      :disabled="keywordDisabled"
      :readonly="props.readonly"
      :maxlength="props.maxlength"
      :minlength="props.minlength"
      :placeholder="props.placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      @keydown.enter.prevent="$emit('submit', props.modelValue)"
      @keydown.esc="$emit('clear')"/>
  </p>
  <button
    v-if="props.useClear"
    type="button"
    :disabled="clearDisabled"
    class="keyword-text__clear"
    @click="emits('clear')">
    <Icon name="x-circle"/>
  </button>
  <button
    v-if="props.useSubmit"
    type="button"
    :disabled="props.processing"
    :class="[
      'keyword-text__submit',
      props.processing && 'processing',
    ]"
    @click="$emit('submit', props.modelValue)">
    <Icon v-if="props.processing" name="loader"/>
    <Icon v-else name="search"/>
  </button>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { printf } from '../../libs/string'
import { message } from '../../message'
import Icon from '../icons/index.vue'

const $input = ref()
const props = defineProps({
  type: { type: String, default: 'text' },
  name: String,
  id: String,
  modelValue: String,
  required: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  minlength: Number,
  maxlength: Number,
  placeholder: {
    type: String,
    default: printf(message.words.pleaseInput, message.word.keyword),
  },
  processing: Boolean,
  useClear: Boolean,
  useSubmit: Boolean,
})
const emits = defineEmits([ 'update:modelValue', 'clear', 'submit' ])
const keywordDisabled = computed(() => {
  return props.disabled || props.processing
})
const clearDisabled = computed(() => {
  return !(props.modelValue?.length > 0)
})

defineExpose({
  $input,
})
</script>

<style src="./keyword.scss" lang="scss" scoped></style>
