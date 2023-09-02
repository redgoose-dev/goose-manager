<template>
<article>
  <PageHeader module="checklist" title="Delete checklist"/>
  <Loading v-if="loading"/>
  <ConfirmDelete
    v-else
    title="이 체크리스트를 삭제할까요?"
    description="이 체크리스트를 삭제하면 복구할 수 없습니다."
    :name="fields.name"
    button-label="체크리스트를 삭제하기"
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
import { formatting } from '../../libs/date'
import { getData, deleteItem } from '../../structure/checklist/delete'
import PageHeader from '../../components/page/header/index.vue'
import ConfirmDelete from '../../components/forms/confirm-delete/index.vue'
import Loading from '../../components/etc/loading.vue'

const router = useRouter()
const route = useRoute()
const fields = reactive({
  name: '',
})
const loading = ref(true)
const processing = ref(false)

async function onSubmit()
{
  try
  {
    processing.value = true
    await deleteItem(Number(route.params.srl))
    processing.value = false
    await router.push('../../list/')
    toast.add('체크리스트를 삭제했습니다.', 'success').then()
  }
  catch (e)
  {
    err(['/pages/checklist/delete.vue', 'onSubmit()'], 'error', e.message)
    processing.value = false
    toast.add('체크리스트를 삭제하지 못했습니다.', 'error').then()
  }
}

onMounted(async () => {
  try
  {
    let res = await getData(Number(route.params.srl))
    fields.name = formatting(res.regdate, {
      dateStyle: 'long',
      timeStyle: 'medium',
    })
    loading.value = false
  }
  catch (e)
  {
    err(['/pages/checklist/delete.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
})
</script>
