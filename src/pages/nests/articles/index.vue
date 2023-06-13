<template>
<article>
  <PageHeader
    module="articles"
    :title="title"
    :description="description"/>
  <TabCategory
    v-if="data.categories?.length > 0"
    :items="data.categories"/>
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
            {
              label: '수정',
              href: `./${item.srl}/edit/${createQueries(['category','page'], route.query)}`,
            },
            {
              label: '삭제',
              href: `./${item.srl}/delete/${createQueries(['category','page'], route.query)}`,
            },
          ]">
          <template v-if="item.private" #after>
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
      <Controller class="articles__controller">
        <template #left>
          <ButtonBasic href="../../" icon-left="cloud">
            둥지
          </ButtonBasic>
          <ButtonBasic href="../categories/" icon-left="server">
            분류
          </ButtonBasic>
        </template>
        <template #right>
          <ButtonBasic
            :href="`./create/${createQueries(['category'], route.query)}`"
            color="key"
            icon-left="plus">
            아티클 만들기
          </ButtonBasic>
        </template>
      </Controller>
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
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { preferenceStore } from '../../../store/preference'
import { filtersStore } from '../../../store/filters'
import { err } from '../../../libs/error'
import { serialize } from '../../../libs/string'
import { scrollTo, getFilterKey } from '../../../libs/util'
import { createQueries } from '../../../components/pages/articles/libs'
import { getData, requestArticles, requestCategories } from '../../../structure/articles'
import PageHeader from '../../../components/page/header/index.vue'
import { Items, Card, Thumbnail, Mark } from '../../../components/item'
import { Controller } from '../../../components/navigation'
import { ButtonBasic } from '../../../components/button'
import Loading from '../../../components/etc/loading.vue'
import Empty from '../../../components/error/empty.vue'
import TabCategory from '../../../components/navigation/tab-category/index.vue'
import Pagination from '../../../components/etc/pagination.vue'
import ArticleFilter from '../../../components/pages/articles/article-filter.vue'

const route = useRoute()
const router = useRouter()
const preference = preferenceStore()
const filters = filtersStore()
const filterKey = ref(getFilterKey())
const data = reactive({
  total: 0,
  index: null,
  nest: null,
  categories: null,
})
const title = computed(() => (data.nest ? `[${data.nest.id}] Articles` : ''))
const description = computed(() => (data.nest ? data.nest.description : ''))
const loading = ref(true)
const page = ref(route.query.page ? Number(route.query.page) : 1)
const theme = computed(() => {
  const { theme } = filters.getFilter(filterKey) || {}
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
  onUpdateAll().then()
})

watch(() => route.query.category, async () => {
  try
  {
    page.value = 1
    scrollTo()
    loading.value = true
    let [ articles, categories ] = await Promise.all([
      requestArticles(),
      requestCategories(),
    ])
    data.total = articles.total
    data.index = articles.index
    data.categories = categories
    loading.value = false
  }
  catch (e)
  {
    err(['/pages/nests/articles/index.vue', 'watch:route.query.category'], 'error', e.message)
    loading.value = false
  }
})
watch(() => route.params.nestSrl, (value) => {
  if (!value) return
  page.value = 1
  onUpdateAll().then()
})

async function onChangePage(page)
{
  let params = {
    ...route.query,
    page: page > 1 ? page : undefined,
  }
  await router.push(`./${serialize(params, true)}`)
}

async function onClickPageItem(n)
{
  await onChangePage(n)
  page.value = n
  await onUpdateArticles()
}

async function onUpdateFilter()
{
  try
  {
    await onChangePage(1)
    page.value = 1
    scrollTo()
    loading.value = true
    let [ articles, categories ] = await Promise.all([
      requestArticles(),
      requestCategories(),
    ])
    data.total = articles.total
    data.index = articles.index
    data.categories = categories
    loading.value = false
  }
  catch (e)
  {
    err(['/pages/nests/articles/index.vue', 'onUpdateFilter()'], 'error', e.message)
    loading.value = false
  }
}

async function onUpdateArticles()
{
  try
  {
    scrollTo()
    loading.value = true
    const articles = await requestArticles()
    data.total = articles.total
    data.index = articles.index
    loading.value = false
  }
  catch (e)
  {
    err(['/pages/nests/articles/index.vue', 'onUpdateArticles()'], 'error', e.message)
    loading.value = false
  }
}

async function onUpdateAll()
{
  try
  {
    scrollTo()
    loading.value = true
    let res = await getData()
    data.total = res.total
    data.index = res.articles
    data.nest = res.nest
    data.categories = res.categories
    loading.value = false
  }
  catch (e)
  {
    err(['/pages/nests/articles/index.vue', 'onUpdateAll()'], 'error', e.message)
    throw e.message
  }
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
