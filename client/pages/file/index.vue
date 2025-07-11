<template>
<article>
  <PageHeader module="file"/>
  <div class="container-over">
    <Loading v-if="state.loading"/>
    <Files
      v-else-if="state.index.length > 0"
      :total="state.total"
      :items="state.index"/>
    <Empty
      v-else
      title="No data"
      message="파일 데이터가 없습니다."/>
  </div>
  <Paginate
    :model-value="state.page"
    :total="state.total"
    :size="preference.file.pagePerSize"
    :range="10"
    @update:model-value="onClickPage"/>
</article>
</template>

<script setup>
import { reactive, onMounted, watch, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { preferenceStore } from '../../store/app.js'
import { serialize } from '../../libs/strings.js'
import { scrollTo } from '../../libs/util.js'
import { getData } from '../../structure/file/index.js'
import PageHeader from '../../components/header/page.vue'
import { Loading, Empty } from '../../components/content/index.js'
import { Paginate } from '../../components/navigation/index.js'
import Files from '../../components/pages/file/files.vue'

const route = useRoute()
const router = useRouter()
const preference = preferenceStore()
const error = inject('error')
const errorPath = [ 'pages', 'file', 'index.vue' ]
const state = reactive({
  loading: true,
  total: 0,
  index: [],
  page: route.query.page ? Number(route.query.page) : 1,
})

onMounted(load)
watch(() => route.query, () => load())

async function load()
{
  try
  {
    scrollTo()
    state.loading = true
    const { total, index } = await getData(route.query.module, route.query.module_srl)
    state.total = total
    state.index = index
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'load()' ],
      message: '파일 데이터를 가져오지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.loading = false
  }
}

async function onClickPage(n)
{
  await onChangePage(n)
  state.page = n
  await load()
}

async function onChangePage(n)
{
  const query = {
    ...route.query,
    page: n > 1 ? n : undefined,
  }
  await router.push(`./${serialize(query, true)}`)
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
