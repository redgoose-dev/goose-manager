<template>
<article class="content-over">
  <PageHeader module="json"/>
  <TabCategory
    v-if="data.categories?.length > 0"
    :items="data.categories"/>
  <Loading v-if="loading"/>
  <Items v-else-if="data.index?.length > 0" theme="card">
    <Card
      v-for="item in data.index"
      :title="item.title"
      :description="item.description"
      :meta="item.meta"
      :href="`./${item.srl}/`"
      :nav="[
        { label: '수정', href: `./${item.srl}/edit/` },
        { label: '삭제', href: `./${item.srl}/delete/` },
      ]"/>
  </Items>
  <Empty v-else title="no item"/>
  <Controller>
    <template #left>
      <ButtonBasic href="./categories/" icon-left="server">
        분류들
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
import { ref, onMounted, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { err } from '../../libs/error'
import { scrollTo } from '../../libs/util'
import { getData } from '../../structure/json'
import PageHeader from '../../components/page/header/index.vue'
import { Items, Card } from '../../components/item'
import { Controller } from '../../components/navigation'
import { ButtonBasic } from '../../components/button'
import Loading from '../../components/etc/loading.vue'
import Empty from '../../components/error/empty.vue'
import TabCategory from '../../components/navigation/tab-category/index.vue'

const route = useRoute()
const loading = ref(false)
const data = reactive({
  total: 0,
  index: [],
  categories: [],
})

async function onUpdateAll()
{
  try
  {
    scrollTo()
    loading.value = true
    const res = await getData()
    data.total = res.total
    data.index = res.json
    data.categories = res.categories
    loading.value = false
  }
  catch (e)
  {
    err(['/pages/json/index.vue', 'onMounted()'], 'error', e.message)
    loading.value = false
  }
}

onMounted(onUpdateAll)
watch(() => route.query.category, onUpdateAll)
</script>
