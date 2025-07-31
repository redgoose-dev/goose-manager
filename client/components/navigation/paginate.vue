<template>
<nav class="paginate">
  <ButtonIcon
    type="button"
    icon-name="chevrons-left"
    :title="!disabledFirstArrow ? '첫 페이지로 이동' : ''"
    :disabled="disabledFirstArrow"
    class="dir dir--first"
    @click="onFirstPage"/>
  <ButtonIcon
    type="ButtonIcon"
    icon-name="chevron-left"
    :title="!(pageBlock <= 0) ? `${range}페이지 이전으로 이동` : ''"
    :disabled="pageBlock <= 0"
    class="dir dir--prev"
    @click="onPrevRange"/>
  <template v-if="pages.length > 0">
    <ButtonBasic
      v-for="item in pages"
      type="button"
      :title="`${item.key}페이지`"
      :disabled="item.active"
      :color="item.active ? 'key-2': ''"
      class="number"
      @click="go(item.key)">
      <component :is="item.active ? 'strong' : 'em'">{{item.key}}</component>
    </ButtonBasic>
  </template>
  <template v-else>
    <ButtonBasic
      type="button"
      :title="`${page || 1}페이지`"
      :disabled="true"
      :color="page === 1 ? 'key-2': ''"
      class="number">
      <component :is="page === 1 ? 'strong' : 'em'">{{page || 1}}</component>
    </ButtonBasic>
  </template>
  <ButtonIcon
    type="button"
    icon-name="chevron-right"
    :title="!(pageBlock >= pageBlockTotal) ? `${range}페이지 다음으로 이동` : ''"
    :disabled="pageBlock >= pageBlockTotal"
    class="dir dir--next"
    @click="onNextRange"/>
  <ButtonIcon
    type="button"
    icon-name="chevrons-right"
    :title="!disabledLastArrow ? '마지막 페이지로 이동' : ''"
    :disabled="disabledLastArrow"
    class="dir dir--last"
    @click="onLastPage"/>
</nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ButtonBasic, ButtonIcon } from '../button/index.js'

const props = defineProps({
  modelValue: { type: [ Number, String ] }, // 1
  total: { type: Number, required: true }, // 0
  size: { type: Number, default: 16 }, // 10
  range: { type: Number, default: 10 }, // 5
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

<style src="./paginate.scss" lang="scss" scoped></style>
