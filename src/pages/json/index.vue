<template>
<article>
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
        { label: message.word.edit, href: `./${item.srl}/edit/` },
        { label: message.word.delete, href: `./${item.srl}/delete/` },
      ]"/>
  </Items>
  <Empty v-else title="no item"/>
  <Controller>
    <template #left>
      <ButtonBasic href="./categories/" icon-left="server">
        {{message.word.categories}}
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic href="./create/" color="key" icon-left="plus">
        {{printf(message.word.isCreate, 'JSON')}}
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { err } from '../../libs/error'
import { scrollTo } from '../../libs/util'
import { printf } from '../../libs/string'
import { getData } from '../../structure/json'
import { message } from '../../message'
import PageHeader from '../../components/page/header/index.vue'
import { Items, Card } from '../../components/item'
import { Controller } from '../../components/navigation'
import { ButtonBasic } from '../../components/button'
import Loading from '../../components/etc/loading.vue'
import Empty from '../../components/error/empty.vue'
import TabCategory from '../../components/navigation/tab-category/index.vue'

interface Data {
  total: number
  index: any[]
  categories: any[]
}

const route = useRoute()
const loading = ref<boolean>(false)
const data = reactive<Data>({
  total: 0,
  index: [],
  categories: [],
})

async function onUpdateAll(): Promise<void>
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
  catch (e: any)
  {
    err(['/pages/json/index.vue', 'onMounted()'], 'error', e.message)
    loading.value = false
  }
}

onMounted(onUpdateAll)
watch(() => route.query.category, onUpdateAll)
</script>
