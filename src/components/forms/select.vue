<template>
<label :class="[
  'select',
  props.size && `select--size-${props.size}`,
  placeholder && 'select--placeholder',
]">
  <select
    :name="props.name"
    :id="props.id"
    :value="props.modelValue"
    :required="props.required"
    :disabled="props.disabled"
    @input="onUpdate">
    <template v-if="props.options?.length > 0">
      <option v-if="props.placeholder" value="">
        {{props.placeholder}}
      </option>
      <option v-for="item in props.options" :value="item.value">
        {{item.label}}
      </option>
    </template>
    <slot/>
  </select>
  <Icon name="code"/>
</label>
</template>

<script setup>
import { computed } from 'vue';
import Icon from '../icons/index.vue';

const props = defineProps({
  name: String,
  id: String,
  modelValue: { type: [ String, Number ], default: '' },
  valueType: String, // text,number
  options: Array,
  required: Boolean,
  disabled: Boolean,
  inline: { type: Boolean, default: false },
  size: { type: String }, // small
  placeholder: { type: String, default: 'Please select' },
});
const emits = defineEmits([ 'update:modelValue' ]);
const placeholder = computed(() => (!props.modelValue && props.placeholder));

function onUpdate(e)
{
  let value;
  switch (props.valueType)
  {
    case 'number':
      value = Number(e.target.value);
      break;
    case 'text':
    default:
      value = e.target.value;
      break;
  }
  emits('update:modelValue', value);
}
</script>

<style src="./select.scss" lang="scss" scoped></style>
