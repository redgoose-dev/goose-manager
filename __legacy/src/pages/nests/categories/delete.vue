<template>
<article>
  <PageHeader
    module="categories"
    prefix="[Article]"
    title="Delete category"/>
  <Loading v-if="loading"/>
  <ConfirmDelete
    v-else
    :title="fields.title"
    :description="fields.description"
    :name="fields.name"
    button-label="분류 삭제하기"
    :processing="processing"
    @cancel="router.back()"
    @submit="onSubmit"/>
</article>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { err } from '../../../libs/error'
import { toast } from '../../../modules/toast'
import { getItem, submit } from '../../../structure/categories/delete'
import PageHeader from '../../../components/page/header/index.vue'
import ConfirmDelete from '../../../components/forms/confirm-delete/index.vue'
import Loading from '../../../components/etc/loading.vue'

const router = useRouter()
const route = useRoute()
const fields = reactive({
  title: '이 분류를 삭제할까요?',
  description: '이 분류를 삭제하면 복구할 수 없습니다.',
  name: '',
})
const loading = ref(true)
const processing = ref(false)

async function onSubmit()
{
  try
  {
    processing.value = true
    await submit(Number(route.params.categorySrl))
    processing.value = false
    await router.push('../../')
    toast.add('분류를 삭제했습니다.', 'success').then()
  }
  catch (e)
  {
    err(['/pages/nests/categories/delete.vue', 'onSubmit()'], 'error', e.message)
    processing.value = false
    toast.add('분류를 삭제하지 못했습니다.', 'error').then()
  }
}

onMounted(async () => {
  try
  {
    loading.value = true
    const res = await getItem(Number(route.params.categorySrl))
    fields.name = `삭제되는 요소: [${res.srl}] ${res.name}`
    loading.value = false
  }
  catch (e)
  {
    err(['/pages/nests/categories/delete.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
})
</script>
