<template>
<article class="content-over">
  <PageHeader module="files"/>
  <Loading v-if="loading"/>
  <Items v-else-if="index.length > 0" theme="brick" class="files-index">
    <Thumbnail
      v-for="item in index"
      :href="item.href"
      target="_blank"
      :image="item.image"
      :title="item.title"
      :alt="item.title"
      :meta="item.meta"/>
  </Items>
  <Empty v-else title="파일이 없습니다."/>
  <Pagination
    v-model="page"
    :total="total"
    :size="preference.files.pagePerSize"
    :range="10"
    @update:modelValue="onClickPageItem"/>
</article>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { preferenceStore } from '../../store/preference'
import { err } from '../../libs/error'
import { getItems } from '../../structure/files'
import { serialize } from '../../libs/string'
import { scrollTo } from '../../libs/util'
import PageHeader from '../../components/page/header/index.vue'
import { Items, Thumbnail } from '../../components/item'
import Pagination from '../../components/etc/pagination.vue'
import Loading from '../../components/etc/loading.vue'
import Empty from '../../components/error/empty.vue'

const route = useRoute()
const router = useRouter()
const preference = preferenceStore()
const loading = ref(true)
const index = ref([])
const total = ref(0)
const page = ref(route.query.page ? Number(route.query.page) : 1)

async function onChangePage(n)
{
  const params = {
    ...route.query,
    page: n > 1 ? n : undefined,
  }
  await router.push(`./${serialize(params, true)}`)
}

async function onClickPageItem(n)
{
  await onChangePage(n)
  page.value = n
  await loadData()
}

async function loadData()
{
  try
  {
    scrollTo()
    loading.value = true
    let res = await getItems()
    total.value = res.total
    index.value = res.index
    loading.value = false
  }
  catch (e)
  {
    err(['/pages/files/index.vue', 'loadData()'], 'error', e.message)
    throw e.message
  }
}

onMounted(() => {
  loadData().then()
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
