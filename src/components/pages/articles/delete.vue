<template>
<article>
  <PageHeader module="articles" title="Delete article"/>
  <Loading v-if="loading"/>
  <ConfirmDelete
    v-else
    :title="fields.title"
    :description="fields.description"
    :name="fields.name"
    button-label="Delete article"
    :processing="processing"
    @cancel="router.back()"
    @submit="onSubmit"/>
</article>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getItem, submit } from '../../../structure/articles/delete'
import { printf } from '../../../libs/string'
import { err } from '../../../libs/error'
import { createQueries } from './libs'
import { message } from '../../../message'
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
  description: message.words.deleteArticle,
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
    toast.add(printf(message.success.delete, message.word.article), 'success')
  }
  catch (e: any)
  {
    err(['/components/pages/articles/delete.vue', 'onSubmit()'], 'error', e.message)
    processing.value = false
    toast.add(printf(message.fail.delete, message.word.article), 'error')
  }
}

onMounted(async () => {
  try
  {
    loading.value = true
    const { title, srl } = await getItem(props.srl)
    fields.title = printf(message.confirm.deleteItem, `${message.word.article}"${title}"`)
    fields.name = `${message.words.deleteItem}: ${srl}`
    loading.value = false
  }
  catch (e: any)
  {
    err(['/components/pages/articles/delete.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
})
</script>
