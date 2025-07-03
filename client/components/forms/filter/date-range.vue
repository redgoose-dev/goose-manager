<template>
<dl class="date-range">
  <dt><label for="range-start">시작</label></dt>
  <dd>
    <FormInput
      type="date"
      name="range-start"
      id="range-start"
      :model-value="props.start"
      size="small"
      @update:model-value="emits('update:start', $event)"/>
  </dd>
  <dt><label for="range-end">종료</label></dt>
  <dd>
    <FormInput
      type="date"
      name="range-end"
      id="range-end"
      :model-value="props.end"
      size="small"
      @update:model-value="emits('update:end', $event)"/>
  </dd>
</dl>
</template>

<script setup>
import { FormInput } from '../../forms/index.js'

const props = defineProps({
  start: String,
  end: String,
})
const emits = defineEmits([ 'update:start', 'update:end' ])
</script>

<style lang="scss" scoped>
.date-range {
  margin: 0;
  padding: 0;
  display: grid;
  grid-template: auto / var(--size-column-size, 32px) 1fr;
  row-gap: 6px;
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
