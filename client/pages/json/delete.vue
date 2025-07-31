<template>
<article>
  <PageHeader module="json" title="Delete JSON"/>
  <Loading v-if="state.loading"/>
  <DeleteConfirm
    v-else-if="state.name"
    title="JSON을 삭제할까요?"
    description="JSON을 삭제하면 하위의 모든 데이터들이 삭제됩니다."
    :name="state.name"
    :processing="state.processing"
    :button-label="state.processing ? '삭제중..' : 'JSON 삭제하기'"
    @cancel="$router.back()"
    @submit="onSubmit"/>
  <Empty v-else title="No data"/>
</article>
</template>

<script setup>
import { reactive, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getData, submit } from '../../structure/json/delete.js'
import PageHeader from '../../components/header/page.vue'
import { DeleteConfirm, Loading, Empty } from '../../components/content/index.js'

const router = useRouter()
const route = useRoute()
const toast = inject('toast')
const error = inject('error')
const errorPath = [ 'pages', 'json', 'delete.vue' ]
const state = reactive({
  srl: Number(route.params.srl),
  loading: true,
  processing: false,
  name: '',
})

onMounted(async () => {
  try
  {
    const { srl, name } = await getData(state.srl)
    state.name = `[${srl}] ${name}`
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: 'JSON을 가져오지 못했습니다.',
      error: e,
      useToast: false,
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
    toast.add('JSON을 삭제했습니다.', 'success').then()
    router.push('../../').then()
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onSubmit' ],
      message: 'JSON 데이터를 삭제하지 못했습니다.',
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
