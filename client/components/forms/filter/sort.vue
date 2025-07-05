<template>
<div class="sort">
  <FormSelect
    id="sort-order"
    name="sort-order"
    :model-value="props.order"
    :options="_orderOptions"
    value-type="string"
    placeholder=""
    size="small"
    @update:model-value="emits('update:order', $event)"/>
  <FormSelect
    id="sort-type"
    name="sort-type"
    :model-value="props.sort"
    :options="_sortOptions"
    value-type="string"
    placeholder=""
    size="small"
    @update:model-value="emits('update:sort', $event)"/>
</div>
</template>

<script setup>
import { computed } from 'vue'
import { FormSelect } from '../index.js'

const props = defineProps({
  order: String,
  sort: String,
  orderOptions: Array,
  sortOptions: Array,
})
const emits = defineEmits(['update:order', 'update:sort'])

const _orderOptions = computed(() => {
  return props.orderOptions?.length > 0 ? props.orderOptions : [
    { label: '번호', value: '' },
    { label: '등록일', value: 'created_at' },
  ]
})
const _sortOptions = computed(() => {
  return props.sortOptions?.length > 0 ? props.sortOptions : [
    { label: 'Z ~ A', value: '' },
    { label: 'A ~ Z', value: 'asc' },
  ]
})
</script>

<style lang="scss" scoped>
.sort {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 8px;
  p {
    margin: 0;
  }
}
</style>
