<template>
<article>
  <PageHeader module="nest" title="Delete Nest"/>
  <Loading v-if="state.loading"/>
  <DeleteConfirm
    v-else-if="fields.name"
    :title="fields.title"
    :description="fields.description"
    :name="fields.name"
    :processing="state.processing"
    :button-label="state.processing ? '둥지 삭제중..' : '둥지 삭제하기'"
    @cancel="$router.back()"
    @submit="onSubmit"/>
</article>
</template>

<script setup>
import { reactive, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getData, submit } from '../../structure/nest/delete.js'
import PageHeader from '../../components/header/page.vue'
import { DeleteConfirm, Loading, Empty } from '../../components/content/index.js'

const router = useRouter()
const route = useRoute()
const toast = inject('toast')
const error = inject('error')
const state = reactive({
  srl: Number(route.params.srl),
  loading: true,
  processing: false,
})
const fields = reactive({
  title: '이 둥지를 삭제할까요?',
  description: '이 둥지를 삭제하면 하위의 "아티클", "분류", "첨부파일" 데이터들이 전부 삭제됩니다.',
  name: '',
})
const errorPath = [ 'pages', 'nest', 'delete.vue' ]

onMounted(async () => {
  try
  {
    const { srl, name } = await getData(state.srl)
    fields.name = `[${srl}] ${name}`
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '둥지 데이터를 가져오지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.loading = false
  }
})

async function onSubmit()
{
  try
  {
    state.processing = true
    await submit(state.srl)
    toast.add('둥지를 삭제했습니다.', 'success').then()
    router.push('../../').then()
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onSubmit' ],
      message: '앱 데이터를 삭제하지 못했습니다.',
      error: e,
    })
    router.push('../../').then()
  }
  finally
  {
    state.processing = false
  }
}
</script>

<style lang="scss" scoped></style>
