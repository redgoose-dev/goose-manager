<template>
<form class="filter" @submit.prevent="onSubmit">
  <fieldset :disabled="props.loading">
    <legend>filter of articles</legend>
    <div class="filter__fields">
      <p class="total">
        <span>Total</span>
        <em>{{total}}</em>
      </p>
      <hr class="filter__line">
      <div class="filter__field type">
        <label for="filter_type">Type</label>
        <FormSelect
          id="filter_type"
          name="filter_type"
          v-model="forms.type"
          :options="[
            { label: 'all', value: 'all' },
            { label: 'public', value: 'public' },
            { label: 'private', value: 'private' },
          ]"
          :placeholder="null"
          size="small"/>
      </div>
      <div class="filter__field sort">
        <label for="filter_order">Sort</label>
        <FormSelect
          id="filter_order"
          name="filter_order"
          v-model="forms.order"
          :options="[
            { label: 'srl', value: 'srl' },
            { label: 'order', value: 'order' },
          ]"
          :placeholder="null"
          size="small"/>
        <FormSelect
          id="filter_sort"
          name="filter_sort"
          v-model="forms.sort"
          :options="[
            { label: 'A to Z', value: 'asc' },
            { label: 'Z to A', value: 'desc' },
          ]"
          :placeholder="null"
          size="small"/>
      </div>
      <div class="filter__field theme">
        <label for="filter_theme">Theme</label>
        <FormSelect
          id="filter_theme"
          name="filter_theme"
          v-model="forms.theme"
          :options="[
            { label: 'List', value: 'list' },
            { label: 'Card', value: 'card' },
            { label: 'Thumbnail', value: 'thumbnail' },
            { label: 'Brick', value: 'brick' },
          ]"
          :placeholder="null"
          size="small"/>
      </div>
      <div class="filter__field keyword">
        <label for="filter_keyword">Keyword</label>
        <Keyword
          ref="$keyword"
          v-model="forms.keyword"
          :minlength="3"
          :maxlength="20"
          placeholder="keyword text"
          size="small"
          :use-clear="true"
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
import { ref, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { filtersStore } from '../../../store/filters'
import { withCommas } from '../../../libs/number'
import { FormSelect, Keyword } from '../../forms'
import { ButtonBasic } from '../../button'

interface Forms {
  type: string
  order: string
  sort: string
  theme: string
  keyword: string
}

const $keyword = ref<any>()
const route = useRoute()
const router = useRouter()
const filters = filtersStore()
const props = defineProps<{
  total: number
  loading: boolean
}>()
const emits = defineEmits([ 'update' ])
const forms = reactive<Forms>({
  type: filters.articles.type || '',
  order: filters.articles.order || '',
  sort: filters.articles.sort || 'desc',
  theme: filters.articles.theme || 'card',
  keyword: filters.articles.keyword || '',
})
const keyword = ref<any>(route.query.q)
const total = computed<string>(() => withCommas(props.total))

function onReset(): void
{
  forms.type = 'all'
  forms.order = 'srl'
  forms.sort = 'desc'
  forms.theme = 'card'
  forms.keyword = ''
  filters.save('articles', {
    type: forms.type,
    order: forms.order,
    sort: forms.sort,
    theme: forms.theme,
    keyword: forms.keyword,
  })
  emits('update')
}

function onSubmit(): void
{
  filters.save('articles', {
    type: forms.type,
    order: forms.order,
    sort: forms.sort,
    theme: forms.theme,
    keyword: forms.keyword,
  })
  emits('update')
}
</script>

<style src="./article-filter.scss" lang="scss" scoped></style>
