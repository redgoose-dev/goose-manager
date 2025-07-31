<template>
<article>
  <PageHeader
    module="tag"
    :title="_title"
    :description="_description"/>
  <Loading v-if="state.loading"/>
  <div v-else-if="state.index?.length > 0">
    <p class="guide">
      태그를 클릭하면 해당 모듈의 목록으로 이동합니다.
    </p>
    <ul class="index">
      <li v-for="o in state.index">
        <Tag
          :label="o.label"
          :use-click="!!o.href"
          color="key"
          @click="onClickTag(o.href)"/>
      </li>
    </ul>
  </div>
  <Empty v-else title="no data"/>
</article>
</template>

<script setup>
import { reactive, computed, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getData } from '../../structure/tag/index.js'
import PageHeader from '../../components/header/page.vue'
import { Loading, Empty } from '../../components/content/index.js'
import { Tag } from '../../components/item/index.js'

const route = useRoute()
const router = useRouter()
const error = inject('error')
const errorPath = [ 'pages', 'tag', 'index.vue' ]
const state = reactive({
  loading: true,
  index: [],
})

const _title = computed(() => {
  switch (route.params.module)
  {
    case 'article':
      return 'Article Tag'
    case 'json':
      return 'JSON Tag'
  }
  return undefined
})
const _description = computed(() => {
  switch (route.params.module)
  {
    case 'article':
      return '아티클에 사용된 태그 목록입니다.'
    case 'json':
      return 'JSON에 사용된 태그 목록입니다.'
  }
  return undefined
})

onMounted(async () => {
  try
  {
    state.index =  await getData(route.params.module)
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '태그 목록을 가져오지 못했습니다.',
      error: e,
      useToast: false,
    })
  }
  finally
  {
    state.loading = false
  }
})

function onClickTag(path)
{
  if (!path) return
  router.push(path).then()
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
