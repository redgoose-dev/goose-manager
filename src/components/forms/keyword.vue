<template>
<div
  :class="[
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
      @click="$emit('click-input', $event)"
      @keydown.enter.prevent="$emit('submit', props.modelValue)"
      @keydown.esc="$emit('clear')"/>
  </p>
  <button
    v-if="props.useClear"
    type="button"
    :disabled="clearDisabled"
    title="Clear"
    class="keyword-text__clear"
    @click="emits('clear')">
    <Icon :name="props.iconClear"/>
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
    <Icon v-else :name="props.iconSubmit"/>
  </button>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
  placeholder: { type: String, default: '키워드를 입력해주세요.' },
  processing: Boolean,
  useClear: Boolean,
  useSubmit: Boolean,
  iconSubmit: { type: String, default: 'search' },
  iconClear: { type: String, default: 'x-circle' },
})
const emits = defineEmits([ 'update:modelValue', 'clear', 'submit', 'click-input' ])
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
