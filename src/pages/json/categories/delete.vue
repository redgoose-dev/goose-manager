<template>
<article>
  <PageHeader
    module="categories"
    prefix="[JSON]"
    title="Delete category"/>
  <Loading v-if="loading"/>
  <ConfirmDelete
    v-else
    :title="fields.title"
    :description="fields.description"
    :name="fields.name"
    :button-label="printf(message.word.isDelete, message.word.category)"
    :processing="processing"
    @cancel="router.back()"
    @submit="onSubmit"/>
</article>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { err } from '../../../libs/error'
import { toast } from '../../../modules/toast'
import { printf } from '../../../libs/string'
import { message } from '../../../message'
import { getItem, submit } from '../../../structure/categories/delete'
import PageHeader from '../../../components/page/header/index.vue'
import ConfirmDelete from '../../../components/forms/confirm-delete/index.vue'
import Loading from '../../../components/etc/loading.vue'

interface Fields {
  title: string
  description: string
  name: string
}

const router = useRouter()
const route = useRoute()
const fields = reactive<Fields>({
  title: printf(message.confirm.deleteItem, message.word.category),
  description: printf(message.words.warningDeleteItem, message.word.category),
  name: '',
})
const loading = ref<boolean>(true)
const processing = ref<boolean>(false)

async function onSubmit(): Promise<void>
{
  try
  {
    processing.value = true
    await submit(Number(route.params.categorySrl))
    processing.value = false
    await router.push('../../')
    toast.add(printf(message.success.delete, message.word.category), 'success').then()
  }
  catch (e: any)
  {
    err(['/pages/json/categories/delete.vue', 'onSubmit()'], 'error', e.message)
    processing.value = false
    toast.add(printf(message.fail.delete, message.word.category), 'error').then()
  }
}

onMounted(async () => {
  try
  {
    loading.value = true
    const res = await getItem(Number(route.params.categorySrl))
    fields.name = `${message.words.deleteItem}: [${res.srl}] ${res.name}`
    loading.value = false
  }
  catch (e: any)
  {
    err(['/pages/json/categories/delete.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
})
</script>
