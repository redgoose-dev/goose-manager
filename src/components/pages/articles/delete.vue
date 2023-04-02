<template>
<article>
  <PageHeader module="articles" title="Delete Article"/>
  <Loading v-if="loading"/>
  <ConfirmDelete
    v-else
    :title="fields.title"
    :description="fields.description"
    :name="fields.name"
    button-label="아티클 삭제하기"
    :processing="processing"
    @cancel="router.back()"
    @submit="onSubmit"/>
</article>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getItem, submit } from '../../../structure/articles/delete'
import { err } from '../../../libs/error'
import { createQueries } from './libs'
import { toast } from '../../../modules/toast'
import PageHeader from '../../page/header/index.vue'
import ConfirmDelete from '../../forms/confirm-delete/index.vue'
import Loading from '../../etc/loading.vue'

interface Props {
  srl: number
}
interface Fields {
  title: string
  name: string
  description: string
}

const router = useRouter()
const route = useRoute()
const props = defineProps<Props>()
const fields = reactive<Fields>({
  title: '',
  description: '이 아티클을 삭제하면 관련된 첨부파일, 댓글들을 삭제하며 복구할 수 없습니다.',
  name: '',
})
const loading = ref<boolean>(false)
const processing = ref<boolean>(false)

async function onSubmit()
{
  try
  {
    processing.value = true
    await submit(props.srl)
    processing.value = false
    await router.push(`../../${createQueries(['category','page'], route.query)}`)
    toast.add('아티클을 삭제했습니다.', 'success').then()
  }
  catch (e: any)
  {
    err(['/components/pages/articles/delete.vue', 'onSubmit()'], 'error', e.message)
    processing.value = false
    toast.add('아티클을 삭제하지 못했습니다.', 'error').then()
  }
}

onMounted(async () => {
  try
  {
    loading.value = true
    const { title, srl } = await getItem(props.srl)
    fields.title = `이 아티클"${title}"을(를) 삭제할까요?`
    fields.name = `삭제되는 요소: ${srl}`
    loading.value = false
  }
  catch (e: any)
  {
    err(['/components/pages/articles/delete.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
})
</script>
