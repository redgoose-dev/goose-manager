<template>
<form class="filter" @submit.prevent="">
  <fieldset :disabled="props.loading">
    <legend>filter of checklist</legend>
    <div class="filter__fields">
      <p class="total">
        <span>모두</span>
        <em>{{total}}</em>
      </p>
      <hr class="filter__line">
      <div class="filter__field range">
        <label for="filter-range">날짜범위</label>
        <FormInput
          type="date"
          name="filter-range"
          id="filter-range"
          v-model="forms.dateStart"
          size="small"
          @update:model-value="onUpdateDateRange"/>
        <FormInput
          type="date"
          v-model="forms.dateEnd"
          size="small"
          @update:model-value="onUpdateDateRange"/>
      </div>
      <div class="filter__field sort">
        <label for="filter-sort">정렬</label>
        <FormSelect
          name="filter-sort"
          id="filter-sort"
          v-model="forms.sort"
          size="small"
          :placeholder="null"
          :options="[
            { label: 'A to Z', value: 'asc' },
            { label: 'Z to A', value: 'desc' },
          ]"
          @update:model-value="onUpdateFilter"/>
      </div>
      <div class="filter__field keyword">
        <label for="filter-keyword">키워드</label>
        <Keyword
          name="filter-keyword"
          id="filter-keyword"
          v-model="keyword"
          placeholder="keyword.."
          :use-clear="true"
          :use-submit="true"
          :minlength="3"
          :maxlength="20"
          @clear="onClearKeyword"
          @submit="onSubmitKeyword"/>
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
      재설정
    </ButtonBasic>
  </nav>
</form>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { filtersStore } from '../../../store/filters'
import { withCommas } from '../../../libs/number'
import { serialize } from '../../../libs/string'
import { checkOrderDate } from '../../../libs/date'
import { FormSelect, Keyword, FormInput } from '../../forms'
import { ButtonBasic } from '../../button'

const route = useRoute()
const router = useRouter()
const props = defineProps({
  total: Number,
  loading: Boolean,
})
const emits = defineEmits([ 'update' ])
const filters = filtersStore()
const forms = reactive({
  dateStart: filters.checklist.dateStart || '',
  dateEnd: filters.checklist.dateEnd || '',
  sort: filters.checklist.sort || 'desc',
})
const keyword = ref(route.query.q)
const total = computed(() => withCommas(props.total))

function onReset()
{
  forms.dateStart = ''
  forms.dateEnd = ''
  forms.sort = 'desc'
  filters.save('checklist', {
    dateStart: forms.dateStart,
    dateEnd: forms.dateEnd,
    sort: forms.sort,
  })
  if (keyword.value) onClearKeyword()
  emits('update')
}

function onUpdateFilter()
{
  filters.save('checklist', {
    dateStart: forms.dateStart,
    dateEnd: forms.dateEnd,
    sort: forms.sort,
  })
  emits('update')
}

function onUpdateDateRange(e)
{
  if (!checkOrderDate(forms.dateStart)) return
  if (!checkOrderDate(forms.dateEnd)) return
  const times = {
    start: new Date(forms.dateStart).getTime(),
    end: new Date(forms.dateEnd).getTime(),
  }
  if (times.start > times.end) return
  onUpdateFilter()
}

function onClearKeyword()
{
  keyword.value = ''
  onSubmitKeyword()
}
function onSubmitKeyword()
{
  const query = serialize({
    ...route.query,
    q: keyword.value || undefined,
  }, true)
  router.push(`./${query}`)
}

watch(() => route.query.q, (value, oldValue) => {
  if (value === oldValue) return
  keyword.value = value
  emits('update')
})
</script>

<style src="./checklist-filter.scss" lang="scss" scoped></style>
