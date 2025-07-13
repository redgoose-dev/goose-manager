<template>
<article>
  <PageHeader
    module="article"
    :title="_header.title"
    :description="_header.description"/>
  <CategoryTab
    :items="state.category"
    :active="route.query.category"
    @select="onSelectCategory"/>
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
            :alt="o.title"
            :image="o.thumbnail"
            :meta="o.meta"
            :use-thumbnail="true"
            :private="o.private"
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
  <Controller>
    <template #left>
      <ButtonGroup>
        <ButtonBasic href="../../" icon-left="cloud">
          둥지
        </ButtonBasic>
        <ButtonBasic
          v-if="state.nest?.useCategory"
          href="../category/"
          icon-left="server"
          color="code">
          분류
        </ButtonBasic>
      </ButtonGroup>
    </template>
    <template #right>
      <ButtonBasic href="./create/" icon-left="plus" color="key">
        아티클 만들기
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { reactive, computed, onMounted, watch, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getData } from '../../../structure/article/index.js'
import { serialize } from '../../../libs/strings.js'
import { scrollTo } from '../../../libs/util.js'
import PageHeader from '../../../components/header/page.vue'
import { Loading, Empty, IndexWithFilter } from '../../../components/content/index.js'
import { Items, Card, Thumbnail, Mark } from '../../../components/item/index.js'
import { Controller, CategoryTab, Paginate } from '../../../components/navigation/index.js'
import { ButtonGroup, ButtonBasic } from '../../../components/button/index.js'
import Filter from '../../../components/pages/article/filter.vue'

const router = useRouter()
const route = useRoute()
const preference = inject('preference')
const error = inject('error')
const errorPath = [ 'pages', 'nest', 'article', 'index.vue' ]
const state = reactive({
  loading: true,
  article: null,
  nest: null,
  category: [],
  tag: [],
})

const _header = computed(() => {
  if (!!state.nest)
  {
    return {
      title: `[${state.nest.code}] Article`,
      description: state.nest.description || undefined,
    }
  }
  else
  {
    return {
      title: 'Nest / Article',
      description: undefined,
    }
  }
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
    const { article, category, nest, tag } = await getData(route.query, {
      nestSrl: Number(route.params.nest),
      size: preference.article.pageCount,
      all: true,
    })
    state.article = article
    state.nest = nest
    state.category = category
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
    const { article, category } = await getData(route.query, {
      nestSrl: Number(route.params.nest),
      size: preference.article.pageCount,
      all: false,
    })
    state.article = article
    state.category = category
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

function onSelectCategory(item, e)
{
  e.preventDefault()
  const query = {
    ...route.query,
    category: item.srl,
    page: null,
  }
  router.push(`./${serialize(query, true)}`).then()
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

<style src="../../article/index.scss" lang="scss" scoped></style>
