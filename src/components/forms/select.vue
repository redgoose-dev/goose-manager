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
    @input="emits('update:modelValue', $event.target.value)">
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
  options: Array,
  required: Boolean,
  disabled: Boolean,
  inline: { type: Boolean, default: false },
  size: { type: String }, // small
  placeholder: { type: String, default: 'Please select' },
});
const emits = defineEmits([ 'update:modelValue' ]);
const placeholder = computed(() => (!props.modelValue && props.placeholder));
</script>

<style src="./select.scss" lang="scss" scoped></style>
