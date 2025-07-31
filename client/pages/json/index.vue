<template>
<article>
  <PageHeader module="json"/>
  <CategoryTab
    :items="state.category"
    :active="route.query.category"
    @select="onSelectCategory"/>
  <IndexWithFilter class="container">
    <template #content>
      <div class="content">
        <Loading v-if="state.loading"/>
        <Items
          v-else-if="state.index?.length > 0"
          theme="card">
          <Card
            v-for="item in state.index"
            :title="item.title"
            :description="item.description"
            :href="`./${item.srl}/`"
            :meta="item.meta"
            :nav="[
              { label: '수정', href: `./${item.srl}/edit/` },
              { label: '삭제', href: `./${item.srl}/delete/` },
            ]"/>
        </Items>
        <Empty v-else title="No data"/>
        <Paginate
          v-if="state.total > 0"
          :model-value="route.query.page"
          :total="state.total"
          :size="preference.json.pageCount"
          :range="preference.json.pageRange"
          @update:model-value="onChangePage"/>
      </div>
    </template>
    <template #filter>
      <Filter
        :loading="state.loading"
        :total="state.total"
        :tag="state.tag"
        @update="onUpdateFilter"/>
    </template>
  </IndexWithFilter>
  <Controller>
    <template #left>
      <ButtonGroup>
        <ButtonBasic href="./category/" icon-left="server">
          분류
        </ButtonBasic>
        <ButtonBasic href="/tag/json/" icon-left="tag" color="code">
          태그
        </ButtonBasic>
      </ButtonGroup>
    </template>
    <template #right>
      <ButtonBasic href="./create/" color="key" icon-left="plus">
        JSON 만들기
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { reactive, onMounted, watch, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getData } from '../../structure/json/index.js'
import { serialize } from '../../libs/strings.js'
import { scrollTo } from '../../libs/util.js'
import PageHeader from '../../components/header/page.vue'
import { Loading, Empty, IndexWithFilter } from '../../components/content/index.js'
import { Items } from '../../components/item/index.js'
import Card from '../../components/item/card.vue'
import { Controller, CategoryTab, Paginate } from '../../components/navigation/index.js'
import { ButtonGroup, ButtonBasic } from '../../components/button/index.js'
import Filter from '../../components/pages/json/filter.vue'

const router = useRouter()
const route = useRoute()
const preference = inject('preference')
const error = inject('error')
const errorPath = [ 'pages', 'json', 'index.vue' ]
const state = reactive({
  loading: true,
  total: 0,
  index: [],
  category: [],
  tag: [],
})

onMounted(async () => {
  try
  {
    state.loading = true
    const { json, category, tag } = await getData(route.query, {
      size: preference.json.pageCount,
      useTag: true,
    })
    state.total = json.total
    state.index = json.index
    state.category = category
    state.tag = tag
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: 'JSON 데이터를 가져오지 못했습니다.',
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
    const { json, category } = await getData(route.query, {
      size: preference.json.pageCount,
      useTag: false,
    })
    state.total = json.total
    state.index = json.index
    state.category = category
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, '_fetchJSON' ],
      message: 'JSON 데이터를 가져오지 못했습니다.',
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
    order: value.order || null,
    sort: value.sort || null,
    tag: value.tag || null,
    category: route.query.category || null,
  }
  router.push(`./${serialize(query, true)}`).then()
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
</script>

<style src="./index.scss" lang="scss" scoped></style>
