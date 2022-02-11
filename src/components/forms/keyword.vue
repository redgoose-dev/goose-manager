<template>
<div :class="[
  'keyword-text',
  props.size && `keyword-text--size-${props.size}`,
  props.disabled && `keyword-text--disabled`,
]">
  <p class="keyword-text__input">
    <input
      :type="props.type"
      :name="props.name"
      :id="props.id"
      :value="props.modelValue"
      :required="props.required"
      :disabled="keywordDisabled"
      :readonly="props.readonly"
      :maxlength="props.maxlength"
      :placeholder="props.placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      @keydown.enter="$emit('submit', props.modelValue)"/>
  </p>
  <button
    type="button"
    :disabled="clearDisabled"
    class="keyword-text__clear"
    @click="emits('clear')">
    <Icon name="x-circle"/>
  </button>
  <button
    type="button"
    :disabled="submitDisabled"
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
import { computed } from 'vue';
import Icon from '../icons/index.vue';

const props = defineProps({
  type: { type: String, default: 'text' },
  name: String,
  id: String,
  modelValue: String,
  size: String, // mini,small
  required: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  maxlength: Number,
  placeholder: { type: String, default: 'Please input keyword.' },
  processing: Boolean,
});
const emits = defineEmits([ 'update:modelValue', 'clear', 'submit' ]);
const keywordDisabled = computed(() => {
  return props.disabled || props.processing;
});
const clearDisabled = computed(() => {
  return !(props.modelValue?.length > 0);
});
const submitDisabled = computed(() => {
  return props.processing || props.modelValue?.length <= 0;
});
</script>

<style src="./keyword.scss" lang="scss" scoped></style>
