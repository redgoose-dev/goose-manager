<template>
<form class="filter" @submit.prevent>
  <FilterTotal
    :total="props.total"
    class="filter__total"/>
  <fieldset :disabled="props.loading" class="filter__fields">
    <legend>체크리스트 필터링 필드</legend>
    <FilterField label="날짜범위" for="range-start">
      <FilterDateRange
        v-model:start="forms.start"
        v-model:end="forms.end"
        @update:start="onUpdate"
        @update:end="onUpdate"/>
    </FilterField>
    <FilterField label="정렬" for="sort-order">
      <FilterSort
        v-model:order="forms.order"
        v-model:sort="forms.sort"
        @update:order="onUpdate"
        @update:sort="onUpdate"/>
    </FilterField>
    <FilterField label="키워드" for="keyword">
      <FormKeyword
        v-model="forms.q"
        id="keyword"
        size="small"
        :use-submit="true"
        @submit="onUpdate"/>
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
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { FilterTotal, FilterField, FilterSort, FilterDateRange } from '../../forms/filter/index.js'
import { FormKeyword } from '../../forms/index.js'
import { ButtonBasic } from '../../button/index.js'

const route = useRoute()
const props = defineProps({
  loading: Boolean,
  total: Number,
})
const emits = defineEmits([ 'update' ])
const forms = reactive({
  order: route.query.order || '',
  sort: route.query.sort || '',
  start: route.query.start || '',
  end: route.query.end || '',
  q: route.query.q || '',
})
let timeout

function onClickReset()
{
  forms.order = ''
  forms.sort = ''
  forms.start = ''
  forms.end = ''
  forms.q = ''
  onUpdate()
}

function onUpdate()
{
  clearTimeout(timeout)
  const result = {
    ...forms,
  }
  emits('update', result)
}
</script>

<style src="./filter.scss" lang="scss" scoped></style>
