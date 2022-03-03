<template>
<nav class="pagination">
  <button
    type="button"
    title="to first page"
    :disabled="disabledFirstArrow"
    :class="[ 'pagination-item', 'pagination-item--far' ]"
    @click="onFirstPage">
    <Icon name="chevrons-left"/>
  </button>
  <button
    type="button"
    :title="`to ${props.range} page prev`"
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
      :title="`${item.key} page`"
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
      :title="`${page || 1} page`"
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
    :title="`to ${props.range} page next`"
    :disabled="pageBlock >= pageBlockTotal"
    :class="[ 'pagination-item', 'pagination-item--range' ]"
    @click="onNextRange">
    <Icon name="chevron-right"/>
  </button>
  <button
    type="button"
    title="to last page"
    :disabled="disabledLastArrow"
    :class="[ 'pagination-item', 'pagination-item--far' ]"
    @click="onLastPage">
    <Icon name="chevrons-right"/>
  </button>
</nav>
</template>

<script setup>
import { computed } from 'vue';
import Icon from '../icons/index.vue';

const props = defineProps({
  modelValue: { type: Number, default: 1 },
  total: { type: Number, default: 0 },
  size: { type: Number, default: 10 },
  range: { type: Number, default: 5 },
});
const emits = defineEmits([ 'update:modelValue' ]);
const page = computed(() => (Number(props.modelValue) > 1 ? Number(props.modelValue) : 1));
const pageCount = computed(() => (Math.ceil(props.total / props.size)));
const pageBlock = computed(() => (Math.floor((page.value - 1) / props.range)));
const pageBlockTotal = computed(() => (Math.floor((pageCount.value - 1) / props.range)));
const pages = computed(() => {
  let items = [];
  let startPage = pageBlock.value * props.range + 1;
  for (let i = 1; i < props.range + 1 && startPage <= pageCount.value; i++, startPage++)
  {
    items[i - 1] = {
      key: startPage,
      active: (startPage === page.value),
    };
  }
  // check empty item
  let checkEmpty = false;
  items.forEach(o => {
    if (o.active) checkEmpty = true;
  });
  return checkEmpty ? items : [];
});
const disabledFirstArrow = computed(() => {
  return pageBlock.value === 0;
});
const disabledLastArrow = computed(() => {
  return page.value >= pageCount.value || pageBlock.value === pageBlockTotal.value;
});

function onPrevRange()
{
  if (page.value > 1)
  {
    let n = page.value - props.range;
    go((n > 1) ? n : 1);
  }
}
function onNextRange()
{
  if (pageBlock.value < pageBlockTotal.value)
  {
    let n = page.value + props.range;
    go(n > pageCount.value ? pageCount.value : n);
  }
}

function onFirstPage()
{
  if (page.value > 1) go(1);
}
function onLastPage()
{
  if (page.value < pageCount.value) go(pageCount.value);
}

function go(page)
{
  if (page.value !== page) emits('update:modelValue', page);
}
</script>

<style src="./pagination.scss" lang="scss" scoped></style>
