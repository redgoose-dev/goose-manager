<template>
<article>
  <PageHeader module="file"/>
  <div class="container-over">
    <Loading v-if="state.loading"/>
    <div v-else-if="state.index.length > 0" class="files">
      <p class="total">총 <strong>{{state.total}}</strong>개의 파일이 등록되어 있습니다.</p>
      <Items theme="thumbnail" class="index">
        <Thumbnail
          v-for="o in _index"
          :href="o.href"
          target="_blank"
          :image="o.thumbnail"
          :icon="o.icon"
          thumbnail-type="contain"
          :title="o.title"
          :meta="o.meta"
          :nav="o.nav"
          :private="true"/>
      </Items>
    </div>
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
import { reactive, computed, onMounted, watch, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getByte, serialize } from '../../libs/strings.js'
import { scrollTo } from '../../libs/util.js'
import { getFilePath } from '../../libs/file.js'
import { dateFormat } from '../../libs/date.js'
import { addQueryParams } from '../../libs/object.js'
import { getData } from '../../structure/file/index.js'
import PageHeader from '../../components/header/page.vue'
import { Loading, Empty } from '../../components/content/index.js'
import { Paginate } from '../../components/navigation/index.js'
import { Items, Thumbnail } from '../../components/item/index.js'

const route = useRoute()
const router = useRouter()
const auth = inject('auth')
const preference = inject('preference')
const error = inject('error')
const errorPath = [ 'pages', 'file', 'index.vue' ]
const state = reactive({
  loading: true,
  total: 0,
  index: [],
  page: route.query.page ? Number(route.query.page) : 1,
})

const _index = computed(() => {
  return state.index.map(o => {
    let thumbnail, icon
    const path = getFilePath(o.srl)
    if (/^image/.test(o.mime))
    {
      thumbnail = `${path}?w=640&h=480&q=65`
    }
    else if (o.mime === 'application/pdf')
    {
      icon = 'file-text'
    }
    else
    {
      icon = 'file'
    }
    let moduleUrl = ''
    switch (o.module)
    {
      case 'article':
      case 'json':
      case 'checklist':
        moduleUrl = `/${o.module}/${o.module_srl}/`
        break
    }
    return {
      srl: o.srl,
      title: o.name,
      href: addQueryParams(`${auth.apiUrl}${path}`, `_a`, auth.token),
      thumbnail,
      icon,
      meta: [
        dateFormat(new Date(o.created_at), '{yyyy}-{MM}-{dd}'),
        o.mime.split('/')[0],
        getByte(o.size),
      ],
      nav: [
        moduleUrl && { label: '모듈 바로가기', href: moduleUrl },
      ].filter(Boolean),
    }
  })
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
      useToast: false,
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
