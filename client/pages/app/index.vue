<template>
<article>
  <PageHeader module="app"/>
  <Loading v-if="state.loading"/>
  <Items v-else-if="state.index?.length > 0" theme="list">
    <Card
      v-for="item in state.index"
      :title="item.title"
      :description="item.description"
      :meta="item.meta"
      :nav="[
        { label: '수정', href: `./${item.srl}/edit/` },
        { label: '삭제', href: `./${item.srl}/delete/` },
      ]"
      :status="[
        { label: '아티클', value: item.count.article },
        { label: '둥지', value: item.count.nest },
      ]"/>
  </Items>
  <Empty v-else title="No data"/>
  <Controller>
    <template #right>
      <ButtonBasic href="./create/" color="key" icon-left="plus">
        앱 만들기
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { reactive, onMounted, inject } from 'vue'
import { getData } from '../../structure/app/index.js'
import PageHeader from '../../components/header/page.vue'
import { Loading, Empty } from '../../components/content/index.js'
import { Items } from '../../components/item/index.js'
import Card from '../../components/item/card.vue'
import { Controller } from '../../components/navigation/index.js'
import { ButtonBasic } from '../../components/button/index.js'

const error = inject('error')
const errorPath = [ 'pages', 'app', 'index.vue' ]
const state = reactive({
  loading: true,
  total: 0,
  index: [],
})

onMounted(async () => {
  try
  {
    state.loading = true
    const res = await getData()
    state.total = res.total
    state.index = res.index
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '앱 데이터를 가져오지 못했습니다.',
      error: e,
      useToast: false,
    })
  }
  finally
  {
    state.loading = false
  }
})
</script>

<style lang="scss" scoped>
:deep(.status) {
  padding: 0 32px;
  gap: 0 28px;
}
</style>
