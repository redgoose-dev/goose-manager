<template>
<div class="tag-selector">
  <Dropdown
    v-model="state.open"
    position="right"
    @update:model-value="onUpdateDropdown">
    <template #trigger>
      <ButtonBasic
        size="small"
        :color="state.open ? 'sub' : 'base'"
        icon-left="tag">
        태그 선택하기
      </ButtonBasic>
    </template>
    <Context
      :items="_contextItems"
      class="context"
      @select="onSelectContext"
      @click.stop>
      <template #before>
        <header class="context__header">
          <FormInput
            ref="$search"
            type="search"
            v-model="context.search"
            id="tag-search"
            name="tag-search"
            size="small"
            placeholder="태그 키워드 검색"
            @update:model-value="onUpdateKeyword"/>
          <ButtonIcon
            icon-name="brush-cleaning"
            size="small"
            color="base"
            @click="onClickReset"/>
        </header>
        <Empty
          v-if="!(_contextItems.length > 0)"
          icon="x-circle"
          title="no tag"
          class="context__empty"/>
      </template>
    </Context>
  </Dropdown>
</div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { pureObject } from '../../../libs/object.js'
import { ButtonBasic, ButtonIcon } from '../../button/index.js'
import { Dropdown, Context } from '../../navigation/dropdown/index.js'
import { FormInput } from '../../forms/index.js'
import { Empty } from '../../content/index.js'

const $search = ref()
const props = defineProps({
  modelValue: Array,
  datalist: Array, // all tags
  limit: { type: Number, default: 3 },
})
const emits = defineEmits([ 'update:modelValue' ])
const state = reactive({
  open: false,
})
const context = reactive({
  search: '',
  items: [],
  selected: [],
})
let timeout

const _contextItems = computed(() => {
  let items = []
  if (context.items.length > 0)
  {
    items = pureObject(context.items)
  }
  else if (context.search)
  {
    return []
  }
  else if (props.datalist.length > 0)
  {
    items = pureObject(props.datalist)
  }
  else
  {
    return []
  }
  return items.map(o => {
    const active = context.selected.some(p => (p.srl === o.srl))
    return {
      srl: o.srl,
      label: o.name,
      iconLeft: 'hash',
      iconRight: active ? 'check' : '',
      color: active ? 'edge' : '',
      fill: active ? 'code' : '',
      active,
    }
  })
})

function onUpdateDropdown(sw)
{
  if (!sw) return
  context.selected = pureObject(props.modelValue || [])
  nextTick(() => {
    if ($search.value) $search.value?.focus()
  })
}

function onUpdateKeyword()
{
  if (!(props.datalist.length > 0)) return
  if (context.search.length <= 0)
  {
    context.items = []
    return
  }
  context.items = props.datalist.filter(o => {
    const regex = new RegExp(context.search, 'i')
    return regex.test(o.name)
  })
}

function onSelectContext(item)
{
  const idx = context.selected.findIndex(o => (o.srl === item.srl))
  if (idx > -1)
  {
    context.selected.splice(idx, 1)
  }
  else
  {
    if (context.selected.length >= props.limit) return
    context.selected.push({ srl: item.srl, name: item.label })
  }
  triggerUpdate()
}

function onClickReset()
{
  context.selected = []
  triggerUpdate()
}

function triggerUpdate()
{
  // update
  emits('update:modelValue', context.selected.length > 0 ? pureObject(context.selected) : [])
}
</script>

<style src="./tag.scss" lang="scss" scoped></style>
