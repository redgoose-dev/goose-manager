<template>
<article>
  <PageHeader module="apps"/>
  <Loading v-if="loading"/>
  <Items v-else-if="index?.length > 0" theme="list">
    <Card
      v-for="item in index"
      :title="item.title"
      :description="item.description"
      :meta="item.meta"
      :nav="[
        { label: '수정', href: `./${item.srl}/edit/` },
        { label: '삭제', href: `./${item.srl}/delete/` },
      ].filter(Boolean)"
      class="item"/>
  </Items>
  <Empty v-else title="no item"/>
  <Controller>
    <template #right>
      <ButtonBasic href="./create/" color="key" icon-left="plus">
        앱 만들기
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import getData from '../../structure/apps'
import { err } from '../../libs/error'
import { Items, Card } from '../../components/item'
import PageHeader from '../../components/page/header/index.vue'
import { Controller } from '../../components/navigation'
import { ButtonBasic } from '../../components/button'
import Loading from '../../components/etc/loading.vue'
import Empty from '../../components/error/empty.vue'

const loading = ref<boolean>(false)
const index = ref<any>()
const total = ref<number>(0)

onMounted(async () => {
  try
  {
    loading.value = true
    let res = await getData()
    total.value = res.total
    index.value = res.index
    loading.value = false
  }
  catch(e: any)
  {
    err(['/pages/apps/index.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
})
</script>

<style lang="scss" scoped>
.item {
  --item-height: 110px;
}
</style>
