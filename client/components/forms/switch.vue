<template>
<label :class="[
  'switch',
  props.disabled && 'disabled',
  props.readonly && 'readonly',
]">
  <input
    type="checkbox"
    :name="props.name"
    :id="props.id"
    :required="props.required"
    :disabled="props.disabled || props.readonly"
    :checked="sw"
    @change="onChange">
  <i/>
</label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: String,
  id: String,
  modelValue: [ String, Number, Boolean ],
  values: Array, // [false,true]
  disabled: Boolean,
  readonly: Boolean,
  required: Boolean,
})
const emits = defineEmits([ 'update:modelValue' ])
const sw = computed(() => {
  if (props.values?.length > 1)
  {
    return props.modelValue === props.values[1]
  }
  else
  {
    return Boolean(props.modelValue)
  }
})

function onChange(e)
{
  let sw = Boolean(e.target.checked)
  let value = (props.values?.length > 1) ? props.values[sw ? 1 : 0] : sw
  emits('update:modelValue', value)
}
</script>

<style src="./switch.scss" lang="scss" scoped></style>
