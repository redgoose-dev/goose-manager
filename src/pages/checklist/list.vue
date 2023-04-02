<template>
<article>
  <PageHeader module="checklist" title="Checklist items"/>
  <div class="checklist-list">
    <div class="checklist-list__body">
      <Loading v-if="loading" class="checklist-list__loading"/>
      <Items v-else-if="(data.index?.length > 0)" theme="card">
        <Card
          v-for="item in data.index"
          :title="item.title"
          :href="`/checklist/${item.srl}/`"
          :nav="[
            { label: '수정', href: `/checklist/${item.srl}/edit/` },
            { label: '삭제', href: `/checklist/${item.srl}/delete/` },
          ]">
          <template #after>
            <div :class="[
              'checklist-list__graph',
              item.percent === 100 && 'complete',
            ]">
              <ProgressDonut :radius="30" :stroke="8" :percent="item.percent"/>
              <p>{{item.percent}}%</p>
            </div>
            <Mark v-if="item.today"/>
          </template>
        </Card>
      </Items>
      <Empty v-else title="체크리스트가 없습니다."/>
      <Pagination
        v-model="page"
        :total="data.total"
        :size="preference.checklist.pageCount"
        :range="preference.checklist.pageRange"
        class="checklist-list__paginate"
        @update:modelValue="onClickPageItem"/>
      <Controller>
        <template #left>
          <ButtonBasic href="../" icon-left="sun" color="key">
            오늘로 이동
          </ButtonBasic>
        </template>
      </Controller>
    </div>
    <aside class="checklist-list__filter">
      <ChecklistFilter
        :total="data.total"
        :loading="loading"
        @update="onUpdateFilter"/>
    </aside>
  </div>
</article>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { preferenceStore } from '../../store/preference'
import { err } from '../../libs/error'
import { serialize } from '../../libs/string'
import { getData } from '../../structure/checklist/list'
import { scrollTo } from '../../libs/util'
import PageHeader from '../../components/page/header/index.vue'
import { Items, Card, Mark } from '../../components/item'
import { Controller } from '../../components/navigation'
import { ButtonBasic } from '../../components/button'
import Loading from '../../components/etc/loading.vue'
import Empty from '../../components/error/empty.vue'
import Pagination from '../../components/etc/pagination.vue'
import ProgressDonut from '../../components/etc/progress-donut.vue'
import ChecklistFilter from '../../components/pages/checklist/checklist-filter.vue'

interface Data {
  total: number
  index: any[]
}

const route = useRoute()
const router = useRouter()
const preference = preferenceStore()
const loading = ref<boolean>(true)
const data = reactive<Data>({
  total: 0,
  index: [],
})
const page = ref<number>(route.query.page ? Number(route.query.page) : 1)

async function onChangePage(page: number): Promise<void>
{
  let params = {
    ...route.query,
    page: page > 1 ? page : undefined,
  }
  await router.push(`./${serialize(params, true)}`)
}

async function onClickPageItem(n: number): Promise<void>
{
  await onChangePage(n)
  page.value = n
  await loadData()
}

async function onUpdateFilter(): Promise<void>
{
  try
  {
    await onChangePage(1)
    page.value = 1
    loading.value = true
    let res = await getData()
    data.total = res.total
    data.index = res.index
    loading.value = false
  }
  catch (e: any)
  {
    err(['/pages/checklist/list.vue', 'onUpdateFilter()'], 'error', e.message)
    loading.value = false
  }
}

async function loadData(): Promise<void>
{
  try
  {
    scrollTo()
    loading.value = true
    const { total, index } = await getData()
    data.total = total
    data.index = index
    loading.value = false
  }
  catch (e: any)
  {
    err(['/pages/checklist/list.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
}

onMounted(() => {
  loadData().then()
})
</script>

<style src="./list.scss" lang="scss" scoped></style>
