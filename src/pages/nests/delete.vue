<template>
<article>
  <PageHeader module="nests" title="Delete nest"/>
  <Loading v-if="loading"/>
  <ConfirmDelete
    v-else
    :title="fields.title"
    :description="fields.description"
    :name="fields.name"
    button-label="둥지 삭제하기"
    :processing="processing"
    @cancel="router.back()"
    @submit="onSubmit"/>
</article>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { err } from '../../libs/error'
import { toast } from '../../modules/toast'
import { getItem, submit } from '../../structure/nests/delete'
import PageHeader from '../../components/page/header/index.vue'
import ConfirmDelete from '../../components/forms/confirm-delete/index.vue'
import Loading from '../../components/etc/loading.vue'

interface Fields {
  title: string
  description: string
  name: string
}

const router = useRouter()
const route = useRoute()
const fields = reactive<Fields>({
  title: '',
  description: '이 둥지를 삭제하면 하위의 "아티클", "분류", "첨부파일" 데이터들이 전부 삭제됩니다.',
  name: '',
})
const loading = ref<boolean>(false)
const processing = ref<boolean>(false)

onMounted(async () => {
  try
  {
    loading.value = true
    let res = await getItem(Number(route.params.srl))
    fields.title = '이 둥지를 삭제할까요?'
    fields.name = `삭제되는 요소: [${res.srl}] ${res.name}`
    loading.value = false
  }
  catch (e: any)
  {
    err(['/pages/nests/delete.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
})

async function onSubmit(): Promise<void>
{
  try
  {
    processing.value = true
    await submit(Number(route.params.srl))
    processing.value = false
    await router.push('../../')
    toast.add('둥지를 삭제했습니다.', 'success').then()
  }
  catch (e: any)
  {
    err(['/pages/nests/delete.vue', 'onSubmit()'], 'error', e.message)
    processing.value = false
    toast.add('둥지를 삭제하지 못했습니다.', 'error').then()
  }
}
</script>
