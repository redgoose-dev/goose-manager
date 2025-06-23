<template>
<dl class="date-range">
  <dt>
    <label for="date-start">시작</label>
  </dt>
  <dd>
    <FormInput
      type="date"
      size="small"/>
  </dd>
  <dt>
    <label for="date-end">종료</label>
  </dt>
  <dd>
    <FormInput
      type="date"
      size="small"/>
  </dd>
</dl>
</template>

<script setup>
import {} from 'vue'
import { FormInput } from '../../forms/index.js'

const props = defineProps({})
const emits = defineEmits([ 'update:modelValue' ])
</script>

<style lang="scss" scoped>
.date-range {
  margin: 0;
  padding: 0;
  display: grid;
  grid-template: auto / var(--size-column-size, 32px) 1fr;
  row-gap: 8px;
  column-gap: 8px;
  align-items: center;
  > dt {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: -.5px;
    user-select: none;
  }
  > dd {
    margin: 0;
  }
}
</style>
