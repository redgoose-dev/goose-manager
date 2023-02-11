<template>
<article>
  <PageHeader module="apps" title="Delete app"/>
  <Loading v-if="loading"/>
  <ConfirmDelete
    v-else
    :title="fields.title"
    :description="fields.description"
    :name="fields.name"
    :button-label="printf(message.word.isDelete, message.word.app)"
    :processing="processing"
    @cancel="$router.back()"
    @submit="onSubmit"/>
</article>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { err } from '../../libs/error'
import { toast } from '../../modules/toast'
import { printf } from '../../libs/string'
import { message } from '../../message'
import { getItem, submit } from '../../structure/apps/delete'
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
  description: message.words.deleteApp,
  name: '',
})
const loading = ref<boolean>(false)
const processing = ref<boolean>(false)

async function onSubmit(): Promise<void>
{
  try
  {
    processing.value = true
    await submit(Number(route.params.srl))
    processing.value = false
    await router.push('../../')
    toast.add(printf(message.success.delete, message.word.app), 'success').then()
  }
  catch (e: any)
  {
    err(['/pages/apps/delete.vue', 'onSubmit()'], 'error', e.message)
    processing.value = false
    toast.add(printf(message.fail.delete, message.word.app), 'error').then()
  }
}

onMounted(async () => {
  try
  {
    loading.value = true
    let { srl, name } = await getItem(Number(route.params.srl))
    fields.title = printf(message.confirm.deleteItem, `${message.word.app}"${name}"`)
    fields.name = `${message.words.deleteItem}: ${srl}`
    loading.value = false
  }
  catch (e: any)
  {
    err(['/pages/apps/delete.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
})
</script>
