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
    @cancel="$router.back()"
    @submit="onSubmit"/>
</article>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getItem, submit } from '../../../structure/articles/delete';
import { printf } from '../../../libs/string';
import { err } from '../../../libs/error';
import { message } from '../../../message';
import { toast } from '../../../modules/toast';
import PageHeader from '../../page/header/index.vue';
import ConfirmDelete from '../../forms/confirm-delete/index.vue';
import Loading from '../../etc/loading.vue';

const props = defineProps({
  srl: { type: Number, required: true },
});
const router = useRouter();
const route = useRoute();
const fields = reactive({
  title: '',
  description: message.words.deleteArticle,
  name: '',
});
const loading = ref(false);
const processing = ref(false);

async function onSubmit()
{
  try
  {
    processing.value = true;
    await submit(props.srl);
    processing.value = false;
    await router.push('../../');
    toast.add(printf(message.success.delete, message.word.article), 'success');
  }
  catch (e)
  {
    err(['components', 'pages', 'articles', 'delete.vue', 'onSubmit()'], 'error', e.message);
    processing.value = false;
    toast.add(printf(message.fail.delete, message.word.article), 'error');
  }
}

onMounted(async () => {
  try
  {
    loading.value = true;
    let res = await getItem(props.srl);
    fields.title = printf(message.confirm.deleteItem, `${message.word.article}"${res.title}"`);
    fields.name = `${message.words.deleteItem}: ${res.srl}`;
    loading.value = false;
  }
  catch (e)
  {
    err(['components', 'pages', 'articles', 'delete.vue', 'onMounted()'], 'error', e.message);
    throw e.message;
  }
});
</script>
