<template>
<article>
  <PageHeader module="checklist" title="Delete Checklist"/>
  <Loading v-if="state.loading"/>
  <DeleteConfirm
    v-else-if="fields.name"
    title="이 체크리스트를 삭제할까요?"
    description="이 체크리스트를 삭제하면 하위의 &quot;태그&quot;, &quot;첨부파일&quot; 데이터들이 전부 삭제됩니다."
    :name="fields.name"
    :processing="state.processing"
    :button-label="state.processing ? '체크리스트 삭제중..' : '삭제하기'"
    @cancel="$router.back()"
    @submit="onSubmit"/>
  <Empty v-else title="No data"/>
</article>
</template>

<script setup>
import { reactive, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getData, submit } from '../../structure/checklist/delete.js'
import PageHeader from '../../components/header/page.vue'
import { DeleteConfirm, Loading, Empty } from '../../components/content/index.js'

const router = useRouter()
const route = useRoute()
const toast = inject('toast')
const error = inject('error')
const errorPath = [ 'pages', 'checklist', 'delete.vue' ]
const state = reactive({
  srl: Number(route.params.srl),
  loading: true,
  processing: false,
})
const fields = reactive({
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
      message: '체크리스트 데이터를 가져오지 못했습니다.',
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
    toast.add('체크리스트를 삭제했습니다.', 'success').then()
    router.push('../../index/').then()
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onSubmit' ],
      message: '체크리스트 데이터를 삭제하지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}
</script>
