<template>
<label :class="[
  'checkbox',
  props.size && `checkbox--size-${props.size}`,
]">
  <input
    type="checkbox"
    :name="props.name"
    :id="props.id"
    :checked="props.modelValue"
    :required="props.required"
    :disabled="props.disabled"
    @change="emits('update:modelValue', Boolean($event.target.checked))">
  <i/>
</label>
</template>

<script setup>
const props = defineProps({
  name: String,
  id: String,
  modelValue: Boolean,
  required: Boolean,
  disabled: Boolean,
  size: String, // small
})
const emits = defineEmits([ 'update:modelValue' ])
</script>

<style src="./checkbox.scss" lang="scss" scoped></style>
