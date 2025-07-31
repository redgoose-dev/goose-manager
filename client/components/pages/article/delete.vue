<template>
<article>
  <PageHeader module="article" title="Delete Article"/>
  <Loading v-if="state.loading"/>
  <DeleteConfirm
    v-else-if="state.name"
    title="이 아티클을 삭제할까요?"
    description="이 앱을 삭제하면 하위의 모든 데이터들이 삭제됩니다."
    :name="state.name"
    :processing="state.processing"
    :button-label="state.processing ? '삭제중..' : '아티클 삭제하기'"
    @cancel="router.back()"
    @submit="onSubmit"/>
  <Empty v-else title="No data"/>
</article>
</template>

<script setup>
import { reactive, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getData, submit } from '../../../structure/article/delete.js'
import PageHeader from '../../header/page.vue'
import { DeleteConfirm, Loading, Empty } from '../../content/index.js'

const props = defineProps({
  srl: Number,
})
const router = useRouter()
const route = useRoute()
const toast = inject('toast')
const error = inject('error')
const errorPath = [ 'components', 'pages', 'article', 'delete.vue' ]
const state = reactive({
  loading: true,
  processing: false,
  name: '',
})

onMounted(async () => {
  try
  {
    const { srl, name } = await getData(props.srl)
    state.name = `[${srl}] ${name}`
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '아티클을 가져오지 못했습니다.',
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
    await submit(props.srl)
    toast.add('아티클을 삭제했습니다.', 'success').then()
    router.push('../../').then()
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onSubmit()' ],
      message: '아티클을 삭제하지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}
</script>
