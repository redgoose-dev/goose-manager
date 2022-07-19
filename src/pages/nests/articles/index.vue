<template>
<article>
  <PageHeader
    module="articles"
    :title="title"
    :description="description"/>
  <Categories
    v-if="data.categories?.length > 0"
    :items="data.categories"/>
  <div class="articles">
    <div class="articles__body">
      <Loading v-if="loading"/>
      <Items
        v-else-if="data.index?.length > 0"
        :theme="filters.articles.theme"
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
            { label: 'Edit', href: `./${item.srl}/edit/${createQueries(['category','page'], route.query)}` },
            { label: 'Delete', href: `./${item.srl}/delete/${createQueries(['category','page'], route.query)}` },
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
        @update:modelValue="onChangePage"/>
      <Controller class="articles__controller">
        <template #left>
          <ButtonBasic href="../../" icon-left="cloud">
            Nests
          </ButtonBasic>
          <ButtonBasic href="../categories/" icon-left="server">
            Categories
          </ButtonBasic>
        </template>
        <template #right>
          <ButtonBasic
            :href="`./create/${createQueries(['category'], route.query)}`"
            color="key"
            icon-left="plus">
            Create article
          </ButtonBasic>
        </template>
      </Controller>
    </div>
    <aside class="articles__filter">
      <ArticleFilter
        :total="data.total"
        :loading="loading"
        @update="onUpdateData"/>
    </aside>
  </div>
</article>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { preferenceStore } from '../../../store/preference'
import { filtersStore } from '../../../store/filters'
import { err } from '../../../libs/error'
import { serialize } from '../../../libs/string'
import { createQueries } from '../../../components/pages/articles/libs'
import { getData, requestArticles, requestCategories } from '../../../structure/articles'
import PageHeader from '../../../components/page/header/index.vue'
import { Items, Card, Thumbnail, Mark } from '../../../components/item'
import { Controller } from '../../../components/navigation'
import { ButtonBasic } from '../../../components/button'
import Loading from '../../../components/etc/loading.vue'
import Empty from '../../../components/error/empty.vue'
import Categories from '../../../components/pages/articles/categories.vue'
import Pagination from '../../../components/etc/pagination.vue'
import ArticleFilter from '../../../components/pages/articles/article-filter.vue'

interface Data {
  total: number
  index: any
  nest: any
  categories: any
}

const route = useRoute()
const router = useRouter()
const preference = preferenceStore()
const filters = filtersStore()
const data = reactive<Data>({
  total: 0,
  index: null,
  nest: null,
  categories: null,
})
const title = computed<string>(() => (data.nest ? `[${data.nest.id}] Articles` : ''))
const description = computed<string>(() => (data.nest ? data.nest.description : ''))
const loading = ref<boolean>(true)
const page = ref<number>(route.query.page ? Number(route.query.page) : 1)
const itemComponent = computed<any>(() => {
  switch (filters.articles.theme)
  {
    case 'list':
    case 'card':
      return Card
    case 'thumbnail':
    case 'brick':
      return Thumbnail
  }
  return Card
})

function onChangePage(page: number): void
{
  let params = {
    ...route.query,
    page: page > 1 ? page : undefined,
  }
  router.push(`./${serialize(params, true)}`)
}

async function onUpdateData(): Promise<void>
{
  try
  {
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
  catch (e: any)
  {
    err(['/pages/nests/articles/index.vue', 'onUpdateData()'], 'error', e.message)
    loading.value = false
  }
}

onMounted(async () => {
  try
  {
    let res = await getData()
    data.total = res.total
    data.index = res.articles
    data.nest = res.nest
    data.categories = res.categories
    loading.value = false
  }
  catch (e: any)
  {
    err(['/pages/nests/articles/index.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
})

watch(() => route.query.category, onUpdateData)
</script>

<style src="./index.scss" lang="scss" scoped></style>
