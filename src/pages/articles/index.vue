<template>
<article class="content-over">
  <PageHeader module="articles"/>
  <div class="articles">
    <div class="articles__body">
      <Loading v-if="loading"/>
      <Items
        v-else-if="data.index?.length > 0"
        :theme="theme"
        class="articles__index">
        <component
          :is="itemComponent"
          v-for="item in data.index"
          :title="item.title"
          :meta="item.meta"
          :href="`./${item.srl}/`"
          :alt="item.title"
          :image="item.image"
          :nav="[
            { label: '수정', href: `./${item.srl}/edit/` },
            { label: '삭제', href: `./${item.srl}/delete/` },
          ]">
          <template #after v-if="item.private">
            <Mark/>
          </template>
        </component>
      </Items>
      <Empty v-else title="no item"/>
      <Pagination
        v-model="page"
        :total="data.total"
        :size="preference.articles.pageCount"
        :range="preference.articles.pageRange"
        class="articles__pagination"
        @update:modelValue="onClickPageItem"/>
    </div>
    <aside class="articles__filter">
      <ArticleFilter
        :total="data.total"
        :loading="loading"
        :storage-key="filterKey"
        @update="onUpdateFilter"/>
    </aside>
  </div>
</article>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { preferenceStore } from '../../store/preference'
import { filtersStore } from '../../store/filters'
import { err } from '../../libs/error'
import { serialize } from '../../libs/string'
import { scrollTo, getFilterKey } from '../../libs/util'
import { getData, requestArticles } from '../../structure/articles'
import PageHeader from '../../components/page/header/index.vue'
import { Items, Card, Thumbnail, Mark } from '../../components/item'
import Loading from '../../components/etc/loading.vue'
import Empty from '../../components/error/empty.vue'
import Pagination from '../../components/etc/pagination.vue'
import ArticleFilter from '../../components/pages/articles/article-filter.vue'

const route = useRoute()
const router = useRouter()
const preference = preferenceStore()
const filters = filtersStore()
const filterKey = ref(getFilterKey())
const data = reactive({ total: 0, index: null })
const loading = ref(false)
const page = ref(route.query.page ? Number(route.query.page) : 1)
const theme = computed(() => {
  const { theme } = filters.getFilter(filterKey.value) || {}
  return theme || 'card'
})
const itemComponent = computed(() => {
  switch (theme.value)
  {
    case 'list':
    case 'card':
    default:
      return Card
    case 'thumbnail':
    case 'brick':
      return Thumbnail
  }
})

onMounted(() => {
  filterKey.value = getFilterKey()
  loadData().then()
})

async function onClickPageItem(n)
{
  await onChangePage(n)
  page.value = n
  await loadData()
}

async function onChangePage(n)
{
  let params = {
    ...route.query,
    page: n > 1 ? n : undefined,
  }
  await router.push(`./${serialize(params, true)}`)
}

async function onUpdateFilter()
{
  try
  {
    await onChangePage(1)
    page.value = 1
    loading.value = true
    let res = await requestArticles()
    data.total = res.total
    data.index = res.index
    loading.value = false
  }
  catch (e)
  {
    err(['/pages/articles/index.vue', 'onUpdateFilter()'], 'error', e.message)
    loading.value = false
  }
}

async function loadData()
{
  try
  {
    scrollTo()
    loading.value = true
    const res = await getData()
    data.total = res.total
    data.index = res.articles
    loading.value = false
  }
  catch (e)
  {
    err(['/pages/articles/index.vue', 'loadData()'], 'error', e.message)
    throw e.message
  }
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
