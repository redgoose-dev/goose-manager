<template>
<article>
  <PageHeader module="files"/>
  <div class="content-over">
    <Loading v-if="loading"/>
    <Files
      v-else-if="index?.length > 0"
      :items="index"/>
    <Empty v-else title="파일이 없습니다."/>
  </div>
  <Pagination
    v-model="page"
    :total="total"
    :size="preference.files.pagePerSize"
    :range="10"
    class="pagination"
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
import Files from '../../components/pages/files/index.vue'
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

<style scoped>
.pagination {
  margin: 40px 0 0;
}
</style>
