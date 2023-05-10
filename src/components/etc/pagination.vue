<template>
<nav class="pagination">
  <button
    type="button"
    :title="!disabledFirstArrow ? '첫 페이지로 이동' : ''"
    :disabled="disabledFirstArrow"
    :class="[ 'pagination-item', 'pagination-item--far' ]"
    @click="onFirstPage">
    <Icon name="chevrons-left"/>
  </button>
  <button
    type="button"
    :title="!(pageBlock <= 0) ? `${range}페이지 이전으로 이동` : ''"
    :disabled="pageBlock <= 0"
    :class="[ 'pagination-item', 'pagination-item--range' ]"
    @click="onPrevRange">
    <Icon name="chevron-left"/>
  </button>
  <template v-if="pages.length > 0">
    <button
      v-for="item in pages"
      type="button"
      :disabled="item.active"
      :title="`${item.key}페이지`"
      :class="[
        'pagination-item',
        'pagination-item--number',
        item.active && 'active',
      ]"
      @click="go(item.key)">
      <em>{{item.key}}</em>
    </button>
  </template>
  <template v-else>
    <button
      type="button"
      :title="`${page || 1}페이지`"
      :disabled="true"
      :class="[
        'pagination-item',
        'pagination-item--number',
        page === 1 && 'active',
      ]">
      <em>{{page || 1}}</em>
    </button>
  </template>
  <button
    type="button"
    :title="!(pageBlock >= pageBlockTotal) ? `${range}페이지 다음으로 이동` : ''"
    :disabled="pageBlock >= pageBlockTotal"
    :class="[ 'pagination-item', 'pagination-item--range' ]"
    @click="onNextRange">
    <Icon name="chevron-right"/>
  </button>
  <button
    type="button"
    :title="!disabledLastArrow ? '마지막 페이지로 이동' : ''"
    :disabled="disabledLastArrow"
    :class="[ 'pagination-item', 'pagination-item--far' ]"
    @click="onLastPage">
    <Icon name="chevrons-right"/>
  </button>
</nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import Icon from '../icons/index.vue'

const props = defineProps({
  modelValue: { type: Number, required: true }, // 1
  total: { type: Number, required: true }, // 0
  size: { type: Number, required: true }, // 10
  range: { type: Number, required: true }, // 5
})
const emits = defineEmits([ 'update:modelValue' ])
const size = ref(props.size || 10)
const range = ref(props.range || 5)
const page = computed(() => (Number(props.modelValue) > 1 ? Number(props.modelValue) : 1))
const pageCount = computed(() => (Math.ceil(props.total / size.value)))
const pageBlock = computed(() => (Math.floor((page.value - 1) / range.value)))
const pageBlockTotal = computed(() => (Math.floor((pageCount.value - 1) / range.value)))
const pages = computed(() => {
  let items = []
  let startPage = pageBlock.value * range.value + 1
  for (let i = 1; i < range.value + 1 && startPage <= pageCount.value; i++, startPage++)
  {
    items[i - 1] = {
      key: startPage,
      active: (startPage === page.value),
    }
  }
  // check empty item
  let checkEmpty = false
  items.forEach(o => {
    if (o.active) checkEmpty = true
  })
  return checkEmpty ? items : []
})
const disabledFirstArrow = computed(() => {
  return pageBlock.value === 0
})
const disabledLastArrow = computed(() => {
  return page.value >= pageCount.value || pageBlock.value === pageBlockTotal.value
})

function onPrevRange()
{
  if (page.value > 1)
  {
    let n = page.value - range.value
    go((n > 1) ? n : 1)
  }
}
function onNextRange()
{
  if (pageBlock.value < pageBlockTotal.value)
  {
    let n = page.value + range.value
    go(n > pageCount.value ? pageCount.value : n)
  }
}

function onFirstPage()
{
  if (page.value > 1) go(1)
}
function onLastPage()
{
  if (page.value < pageCount.value) go(pageCount.value)
}

function go(n)
{
  if (page.value !== n) emits('update:modelValue', n)
}
</script>

<style src="./pagination.scss" lang="scss" scoped></style>
