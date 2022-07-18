<template>
<form class="filter" @submit.prevent="onSubmit">
  <fieldset :disabled="props.loading">
    <legend>filter of checklist</legend>
    <div class="filter__fields">
      <p class="total">
        <span>Total</span>
        <em>{{total}}</em>
      </p>
      <hr class="filter__line">
      <div class="filter__field range">
        <label for="filter-range">Date range</label>
        <FormInput
          type="date"
          name="filter-range"
          id="filter-range"
          v-model="forms.dateStart"
          size="small"/>
        <FormInput
          type="date"
          v-model="forms.dateEnd"
          size="small"/>
      </div>
      <div class="filter__field sort">
        <label for="filter-sort">Sort</label>
        <FormSelect
          name="filter-sort"
          id="filter-sort"
          v-model="forms.sort"
          size="small"
          :placeholder="null"
          :options="[
            { label: 'A to Z', value: 'asc' },
            { label: 'Z to A', value: 'desc' },
          ]"/>
      </div>
      <div class="filter__field keyword">
        <label for="filter-keyword">Keyword</label>
        <Keyword
          name="filter-keyword"
          id="filter-keyword"
          v-model="forms.keyword"
          placeholder="keyword text"
          :use-clear="true"
          :minlength="3"
          :maxlength="20"
          @clear="forms.keyword = ''"
          @submit="onSubmit"/>
      </div>
    </div>
  </fieldset>
  <nav class="filter__nav">
    <ButtonBasic
      type="button"
      size="small"
      icon-left="rotate-ccw"
      :disabled="props.loading"
      @click="onReset">
      Reset
    </ButtonBasic>
    <ButtonBasic
      type="submit"
      color="key"
      size="small"
      icon-left="check"
      :disabled="props.loading">
      Update filter
    </ButtonBasic>
  </nav>
</form>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { filtersStore } from '../../../store/filters'
import { withCommas } from '../../../libs/number'
import { FormSelect, Keyword, FormInput } from '../../forms'
import ButtonBasic from '../../button/basic.vue'

interface Forms {
  dateStart: string
  dateEnd: string
  sort: string
  keyword: string
}

const route = useRoute()
const router = useRouter()
const props = defineProps<{
  total: number
  loading: boolean
}>()
const emits = defineEmits([ 'update' ])
const filters = filtersStore()
const forms = reactive<Forms>({
  dateStart: filters.checklist.dateStart || '',
  dateEnd: filters.checklist.dateEnd || '',
  sort: filters.checklist.sort || 'desc',
  keyword: filters.checklist.keyword || '',
})
const total = computed<string>(() => withCommas(props.total))

function onReset(): void
{
  forms.dateStart = ''
  forms.dateEnd = ''
  forms.sort = 'desc'
  forms.keyword = ''
  filters.save('checklist', {
    dateStart: forms.dateStart,
    dateEnd: forms.dateEnd,
    sort: forms.sort,
    keyword: forms.keyword,
  })
  emits('update')
}

function onSubmit(): void
{
  filters.save('checklist', {
    dateStart: forms.dateStart,
    dateEnd: forms.dateEnd,
    sort: forms.sort,
    keyword: forms.keyword,
  })
  emits('update')
}
</script>

<style src="./checklist-filter.scss" lang="scss" scoped></style>
