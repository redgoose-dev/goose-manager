<template>
<article>
  <PageHeader module="users" title="Delete user"/>
  <Loading v-if="loading"/>
  <ConfirmDelete
    v-else
    :title="fields.title"
    :description="fields.description"
    :name="fields.name"
    button-label="Delete user"
    :processing="processing"
    @cancel="router.back()"
    @submit="onSubmit"/>
</article>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { err } from '../../libs/error'
import { toast } from '../../modules/toast'
import { getItem, submit } from '../../structure/users/delete'
import PageHeader from '../../components/page/header/index.vue'
import ConfirmDelete from '../../components/forms/confirm-delete/index.vue'
import Loading from '../../components/etc/loading.vue'

const router = useRouter()
const route = useRoute()
const fields = reactive({
  title: '',
  name: '',
  description: '이 사용자를 삭제하면 복구할 수 없습니다.',
})
const loading = ref(true)
const processing = ref(false)

async function onSubmit()
{
  try
  {
    processing.value = true
    await submit(Number(route.params.srl))
    processing.value = false
    await router.push('../../')
    toast.add('사용자를 삭제했습니다.', 'success').then()
  }
  catch (e)
  {
    err(['/pages/users/delete.vue', 'onSubmit()'], 'error', e.message)
    processing.value = false
    toast.add('사용자를 수정하지 못했습니다.', 'error').then()
  }
}

onMounted(async () => {
  try
  {
    loading.value = true
    let res = await getItem(Number(route.params.srl))
    fields.title = `이 사용자(${res.name})를 삭제할까요?`
    fields.name = `삭제되는 요소: ${res.email}`
    loading.value = false
  }
  catch (e)
  {
    err(['/pages/users/delete.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
})
</script>
