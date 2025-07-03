<template>
<article>
  <PageHeader module="checklist" title="Checklist Index">
    <ButtonBasic href="../" icon-left="sun" color="key" size="small">
      오늘로 이동
    </ButtonBasic>
  </PageHeader>
  <IndexWithFilter class="container">
    <template #content>
      <Loading v-if="state.loading"/>
      <Items v-else-if="state.index?.length > 0">
        <Card
          v-for="o in state.index"
          :title="o.title"
          :href="`../${o.srl}/`"
          :nav="[
            { label: '수정', href: `../${o.srl}/edit/` },
            { label: '삭제', href: `../${o.srl}/delete/` },
          ]">
          <template #after>
            <div
              :class="[
                'graph',
                o.percent === 100 && 'complete',
                o.percent === 0 && 'zero',
              ]">
              <ProgressDonut
                :radius="30"
                :stroke="7"
                :percent="o.percent"/>
              <p>{{o.percent}}%</p>
            </div>
            <Mark v-if="o.today"/>
          </template>
        </Card>
      </Items>
      <Empty v-else title="No data"/>
      <Paginate
        v-if="state.total > 0"
        :model-value="route.query.page"
        :total="state.total"
        :size="preference.checklist.pageCount"
        :range="preference.checklist.pageRange"
        @update:model-value="onChangePage"/>
    </template>
    <template #filter>
      <Filter
        :loading="state.loading"
        :total="state.total"
        @update="onUpdateFilter"/>
    </template>
  </IndexWithFilter>
</article>
</template>

<script setup>
import { reactive, onMounted, inject, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getData } from '../../structure/checklist/index.js'
import { serialize } from '../../libs/strings.js'
import { scrollTo } from '../../libs/util.js'
import PageHeader from '../../components/header/page.vue'
import { Loading, Empty, IndexWithFilter, ProgressDonut } from '../../components/content/index.js'
import { ButtonBasic } from '../../components/button/index.js'
import { Items, Card, Mark } from '../../components/item/index.js'
import { Paginate } from '../../components/navigation/index.js'
import Filter from '../../components/pages/checklist/filter.vue'

const route = useRoute()
const router = useRouter()
const preference = inject('preference')
const error = inject('error')
const errorPath = [ 'pages', 'checklist', 'index.vue' ]
const state = reactive({
  loading: true,
  total: 0,
  index: [],
})

onMounted(_fetch)
watch(() => route.query, _fetch)

async function _fetch()
{
  try
  {
    scrollTo()
    state.loading = true
    const res = await getData(route.query, {
      size: preference.checklist.pageCount,
    })
    state.total = res.total
    state.index = res.index
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, '_fetch' ],
      message: '체크리스트 목록을 가져오지 못했습니다.',
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
    start: value.start || null,
    end: value.end || null,
    q: value.q || null,
  }
  router.push(`./${serialize(query, true)}`).then()
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
