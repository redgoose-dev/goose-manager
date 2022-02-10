<template>
<label :class="[
  'radio',
  size && `radio--size-${size}`
]">
  <input
    type="radio"
    :name="props.name"
    :id="props.id"
    :value="props.value"
    :required="required"
    :disabled="disabled"
    :checked="props.value === props.modelValue"
    @change="emits('update:modelValue', $event.target.value)">
  <i/>
</label>
</template>

<script setup>
const props = defineProps({
  name: String,
  id: String,
  value: [ String, Number, Boolean ],
  modelValue: [ String, Number, Boolean ],
  required: Boolean,
  disabled: Boolean,
  size: String,
});
const emits = defineEmits([ 'update:modelValue' ]);
</script>

<style src="./radio.scss" lang="scss" scoped></style>
