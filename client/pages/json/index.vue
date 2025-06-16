<template>
<article>
  <PageHeader module="json"/>
  <CategoryTab :items="state.category"/>
  <IndexWithFilter class="content">
    <template #content>
      <Loading v-if="state.loading"/>
      <template v-else-if="state.index?.length > 0">
        <Items>
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
        <Paginate
          :model-value="Number(route.params.page) || 1"
          :total="state.total"
          :size="5"
          @update:model-value="onChangePage"/>
      </template>
      <Empty v-else title="No data"/>
    </template>
    <template #filter>
      <Filter/>
    </template>
  </IndexWithFilter>
  <Controller>
    <template #left>
      <ButtonBasic href="./category/" icon-left="server">
        분류
      </ButtonBasic>
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
import { useRoute } from 'vue-router'
import { getData } from '../../structure/json/index.js'
import PageHeader from '../../components/header/page.vue'
import { Loading, Empty, IndexWithFilter } from '../../components/content/index.js'
import { Card, Items } from '../../components/item/index.js'
import { Controller, CategoryTab, Paginate } from '../../components/navigation/index.js'
import { ButtonBasic } from '../../components/button/index.js'
import Filter from '../../components/pages/json/filter.vue'

const route = useRoute()
const error = inject('error')
const errorPath = [ 'pages', 'json', 'index.vue' ]
const state = reactive({
  loading: true,
  total: 0,
  index: [],
  category: [],
})

onMounted(_fetch)
watch(() => route.query.category, _fetch)

async function _fetch()
{
  try
  {
    state.loading = true
    const { json, category } = await getData(route.query)
    state.total = json.total
    state.index = json.index
    state.category = category
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
}

async function onChangePage(n)
{
  // TODO
  console.log('onChangePage()', n)
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
