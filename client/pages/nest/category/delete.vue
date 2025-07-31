<template>
<article>
  <PageHeader module="nest" title="Nest / Delete Category"/>
  <Loading v-if="state.loading"/>
  <DeleteConfirm
    v-else-if="fields.name"
    :title="fields.title"
    :description="fields.description"
    :name="fields.name"
    :processing="state.processing"
    :button-label="state.processing ? '분류 삭제중..' : '분류 삭제하기'"
    @cancel="$router.back()"
    @submit="onSubmit"/>
  <Empty v-else title="No data"/>
</article>
</template>

<script setup>
import { reactive, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getData, submit } from '../../../structure/category/delete.js'
import PageHeader from '../../../components/header/page.vue'
import { DeleteConfirm, Loading, Empty } from '../../../components/content/index.js'

const router = useRouter()
const route = useRoute()
const toast = inject('toast')
const error = inject('error')
const errorPath = [ 'pages', 'nest', 'category', 'delete.vue' ]
const state = reactive({
  srl: Number(route.params.category),
  loading: true,
  processing: false,
})
const fields = reactive({
  title: '이 분류를 삭제할까요?',
  description: '이 분류를 삭제하면 해당되는 데이터들은 전부 none 으로 변경됩니다.',
  name: '',
})

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
      message: '분류 데이터를 가져오지 못했습니다.',
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
    toast.add('분류를 삭제했습니다.', 'success').then()
    router.push('../../').then()
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onSubmit' ],
      message: '분류를 삭제하지 못했습니다.',
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
