<template>
<form class="filter" @submit.prevent="">
  <fieldset :disabled="props.loading">
    <legend>filter of articles</legend>
    <div class="filter__fields">
      <p class="total">
        <span>모두</span>
        <em>{{total}}</em>
      </p>
      <hr class="filter__line">
      <div class="filter__field type">
        <label for="filter_type">타입</label>
        <FormSelect
          id="filter_type"
          name="filter_type"
          v-model="forms.type"
          :options="[
            { label: '모두', value: 'all' },
            { label: '공개', value: 'public' },
            { label: '비공개', value: 'private' },
          ]"
          :placeholder="null"
          size="small"
          @update:model-value="onUpdateFilter"/>
      </div>
      <div class="filter__field sort">
        <label for="filter_order">정렬</label>
        <FormSelect
          id="filter_order"
          name="filter_order"
          v-model="forms.order"
          :options="[
            { label: 'srl', value: 'srl' },
            { label: 'order', value: 'order' },
          ]"
          :placeholder="null"
          size="small"
          @update:model-value="onUpdateFilter"/>
        <FormSelect
          id="filter_sort"
          name="filter_sort"
          v-model="forms.sort"
          :options="[
            { label: 'A to Z', value: 'asc' },
            { label: 'Z to A', value: 'desc' },
          ]"
          :placeholder="null"
          size="small"
          @update:model-value="onUpdateFilter"/>
      </div>
      <div class="filter__field theme">
        <label for="filter_theme">테마</label>
        <FormSelect
          id="filter_theme"
          name="filter_theme"
          v-model="forms.theme"
          :options="[
            { label: '목록', value: 'list' },
            { label: '카드', value: 'card' },
            { label: '썸네일', value: 'thumbnail' },
            { label: '벽돌', value: 'brick' },
          ]"
          :placeholder="null"
          size="small"
          @update:model-value="onUpdateFilter"/>
      </div>
      <div class="filter__field keyword">
        <label for="filter_keyword">키워드</label>
        <Keyword
          ref="$keyword"
          v-model="keyword"
          id="filter_keyword"
          :minlength="3"
          :maxlength="20"
          placeholder="keyword.."
          size="small"
          :use-clear="true"
          :use-submit="true"
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
import { ref, reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { filtersStore } from '../../../store/filters'
import { withCommas } from '../../../libs/number'
import { serialize } from '../../../libs/string'
import { FormSelect, Keyword } from '../../forms'
import { ButtonBasic } from '../../button'

const $keyword = ref()
const route = useRoute()
const router = useRouter()
const filters = filtersStore()
const props = defineProps({
  total: Number,
  loading: Boolean,
  storageKey: String,
})
const emits = defineEmits([ 'update' ])
const forms = reactive({
  type: filters.data[props.storageKey]?.type || 'all',
  order: filters.data[props.storageKey]?.order || 'order',
  sort: filters.data[props.storageKey]?.sort || 'desc',
  theme: filters.data[props.storageKey]?.theme || 'card',
})
const keyword = ref(route.query.q)
const total = computed(() => withCommas(props.total))

function onReset()
{
  forms.type = 'all'
  forms.order = 'srl'
  forms.sort = 'desc'
  forms.theme = 'card'
  filters.save(props.storageKey, {
    type: forms.type,
    order: forms.order,
    sort: forms.sort,
    theme: forms.theme,
  })
  if (keyword.value) onClearKeyword()
  emits('update')
}

function onSubmit()
{
  filters.save(props.storageKey, {
    type: forms.type,
    order: forms.order,
    sort: forms.sort,
    theme: forms.theme,
  })
  emits('update')
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

function onUpdateFilter()
{
  filters.save(props.storageKey, {
    type: forms.type,
    order: forms.order,
    sort: forms.sort,
    theme: forms.theme,
  })
  emits('update')
}

watch(() => route.query.q, (value, oldValue) => {
  if (value === oldValue) return
  keyword.value = value
  emits('update')
})
</script>

<style src="./article-filter.scss" lang="scss" scoped></style>
