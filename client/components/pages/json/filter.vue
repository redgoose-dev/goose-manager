<template>
<form class="filter" @submit.prevent>
  <FilterTotal
    :total="props.total"
    class="filter__total"/>
  <fieldset :disabled="props.loading" class="filter__fields">
    <legend>JSON 필터링 필드</legend>
    <FilterField label="정렬" for="sort-order">
      <FilterSort
        v-model:order="forms.order"
        v-model:sort="forms.sort"
        @update:order="onUpdate"
        @update:sort="onUpdate"/>
    </FilterField>
    <FilterField label="태그">
      <FilterTag
        v-model="forms.tag"
        :datalist="props.tag"
        :limit="5"
        @update:model-value="onUpdate"/>
      <p v-if="forms.tag.length > 0" class="selected-tags">
        <Tag
          v-for="(o,k) in forms.tag"
          :label="o.name"
          :use-remove="true"
          color="code"
          @remove="onRemoveTag(k)"/>
      </p>
    </FilterField>
  </fieldset>
  <nav class="filter__submit">
    <ButtonBasic
      size="small"
      icon-left="rotate-ccw"
      :disabled="props.loading"
      @click="onClickReset">
      재설정
    </ButtonBasic>
  </nav>
</form>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { FilterTotal, FilterField, FilterSort, FilterTag } from '../../forms/filter/index.js'
import { Tag } from '../../item/index.js'
import { ButtonBasic } from '../../button/index.js'

const route = useRoute()
const props = defineProps({
  loading: Boolean,
  total: Number,
  tag: Array,
})
const emits = defineEmits([ 'update' ])
const forms = reactive({
  order: route.query.order || '',
  sort: route.query.sort || '',
  tag: route.query.tag ? convertTagToArray(route.query.tag) : [], // { srl,name }
})
let timeout

watch(() => props.tag, () => {
  forms.tag = convertTagToArray(route.query.tag)
})

function convertTagToArray(str)
{
  if (!str) return []
  if (!(props.tag.length > 0)) return []
  return str.split(',').map(o => {
    if (!o) return false
    return props.tag.find(p => (p.srl === Number(o))) || false
  }).filter(Boolean)
}

function onRemoveTag(idx)
{
  forms.tag.splice(idx, 1)
  onUpdate()
}

function onClickReset()
{
  forms.order = ''
  forms.sort = ''
  forms.tag = []
  onUpdate()
}

function onUpdate()
{
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    const tag = forms.tag.map(o => (o.srl)).join(',')
    const result = {
      ...forms,
      tag,
    }
    emits('update', result)
  }, 100)
}
</script>

<style src="./filter.scss" lang="scss" scoped></style>
