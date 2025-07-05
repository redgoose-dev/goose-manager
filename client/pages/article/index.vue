<template>
<article>
  <PageHeader module="article"/>
  <IndexWithFilter class="container-over">
    <template #content>
      <div class="content">
        <Loading v-if="state.loading"/>
        <Items
          v-else-if="state.article?.index?.length > 0"
          :theme="preference.article.indexTheme"
          class="items">
          <component :is="_itemComponent"
            v-for="o in state.article.index"
            :href="`./${o.srl}/`"
            :title="o.title"
            :image="o.thumbnail"
            :meta="o.meta"
            :nav="[
              { label: '수정', href: `./${o.srl}/edit/` },
              { label: '삭제', href: `./${o.srl}/delete/` },
            ]">
            <template #after>
              <Mark v-if="o.private"/>
            </template>
          </component>
        </Items>
        <Empty v-else title="No data"/>
        <Paginate
          v-if="state.article?.total > 0"
          :model-value="route.query.page"
          :total="state.article?.total"
          :size="preference.article.pageCount"
          :range="preference.article.pageRange"
          class="paginate"
          @update:model-value="onChangePage"/>
      </div>
    </template>
    <template #filter>
      <Filter
        :loading="state.loading"
        :total="state.article?.total"
        :tag="state.tag"
        @update="onUpdateFilter"/>
    </template>
  </IndexWithFilter>
</article>
</template>

<script setup>
import { reactive, computed, onMounted, watch, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getData } from '../../structure/article/index.js'
import { serialize } from '../../libs/strings.js'
import { scrollTo } from '../../libs/util.js'
import PageHeader from '../../components/header/page.vue'
import { Loading, Empty, IndexWithFilter } from '../../components/content/index.js'
import { Items, Card, Thumbnail, Mark } from '../../components/item/index.js'
import { Paginate } from '../../components/navigation/index.js'
import Filter from '../../components/pages/article/filter.vue'

const router = useRouter()
const route = useRoute()
const preference = inject('preference')
const error = inject('error')
const errorPath = [ 'pages', 'article', 'index.vue' ]
const state = reactive({
  loading: true,
  article: null,
  tag: [],
})

const _itemComponent = computed(() => {
  switch (preference.article.indexTheme)
  {
    case 'thumbnail':
      return Thumbnail
    case 'card':
    default:
      return Card
  }
})

onMounted(async () => {
  try
  {
    state.loading = true
    const { article, tag } = await getData(route.query, {
      size: preference.article.pageCount,
      all: true,
    })
    state.article = article
    state.tag = tag
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '아티클 데이터을 가져오지 못했습니다.',
      error: e,
      useToast: false,
    })
  }
  finally
  {
    state.loading = false
  }
})
watch(() => route.query, _fetchContent)

async function _fetchContent()
{
  try
  {
    scrollTo()
    state.loading = true
    const { article } = await getData(route.query, {
      size: preference.article.pageCount,
      all: false,
    })
    state.article = article
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, '_fetchContent()' ],
      message: '아티클 데이터을 가져오지 못했습니다.',
      error: e,
      useToast: false,
    })
  }
  finally
  {
    state.loading = false
  }
}

function onChangePage(n)
{
  let _query = { ...route.query }
  _query.page = n > 1 ? n : NaN
  router.push(`./${serialize(_query, true)}`).then()
}

function onUpdateFilter(value)
{
  const query = {
    mode: value.mode || null,
    sort: value.sort || null,
    order: value.order || null,
    tag: value.tag || null,
    q: value.q || null,
    category: route.query.category || null,
  }
  router.push(`./${serialize(query, true)}`).then()
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
