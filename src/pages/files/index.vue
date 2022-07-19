<template>
<article>
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
  <Empty v-else title="no item"/>
  <Pagination
    v-model="page"
    :total="total"
    :size="preference.files.pagePerSize"
    :range="10"
    @update:modelValue="onChangePage"/>
</article>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { preferenceStore } from '../../store/preference'
import { err } from '../../libs/error'
import { getItems } from '../../structure/files'
import { serialize } from '../../libs/string'
import PageHeader from '../../components/page/header/index.vue'
import { Items, Thumbnail } from '../../components/item'
import Pagination from '../../components/etc/pagination.vue'
import Loading from '../../components/etc/loading.vue'
import Empty from '../../components/error/empty.vue'

const route = useRoute()
const router = useRouter()
const preference = preferenceStore()
const loading = ref<boolean>(true)
const index = ref<any>([])
const total = ref<number>(0)
const page = ref<number>(route.query.page ? Number(route.query.page) : 1)

function onChangePage(page: number): void
{
  const params = {
    ...route.query,
    page: page > 1 ? page : undefined,
  }
  router.push(`./${serialize(params, true)}`)
}

onMounted(async () => {
  try
  {
    let res = await getItems()
    total.value = res.total
    index.value = res.index
    loading.value = false
  }
  catch (e: any)
  {
    err(['/pages/files/index.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
