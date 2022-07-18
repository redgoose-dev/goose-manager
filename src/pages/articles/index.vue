<template>
<article>
  <PageHeader module="articles"/>
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
            { label: 'Edit', href: `./${item.srl}/edit/` },
            { label: 'Delete', href: `./${item.srl}/delete/` },
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
        @update:modelValue="onChangePage"/>
    </div>
    <aside class="articles__filter">
      <ArticleFilter
        :total="data.total"
        :loading="loading"
        @update="onUpdateFilter"/>
    </aside>
  </div>
</article>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { preferenceStore } from '../../store/preference'
import { filtersStore } from '../../store/filters'
import { err } from '../../libs/error'
import { serialize } from '../../libs/string'
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
const data = reactive<any>({ total: 0, index: null })
const loading = ref<boolean>(false)
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

async function onUpdateFilter(): Promise<void>
{
  try
  {
    loading.value = true
    let res = await requestArticles()
    data.total = res.total
    data.index = res.index
    loading.value = false
  }
  catch (e: any)
  {
    err(['/pages/articles/index.vue', 'onUpdateFilter()'], 'error', e.message)
    loading.value = false
  }
}

onMounted(async () => {
  try
  {
    loading.value = true
    const res = await getData()
    data.total = res.total
    data.index = res.articles
    loading.value = false
  }
  catch (e: any)
  {
    err(['/pages/articles/index.vue', 'onMounted()'], 'error', e.message)
    loading.value = false
  }
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
