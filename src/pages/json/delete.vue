<template>
<article>
  <PageHeader module="json" title="Delete JSON"/>
  <Loading v-if="loading"/>
  <ConfirmDelete
    v-else
    :title="fields.title"
    :description="fields.description"
    :name="fields.name"
    button-label="Delete JSON"
    :processing="processing"
    @cancel="$router.back()"
    @submit="onSubmit"/>
</article>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { err } from '../../libs/error';
import { printf } from '../../libs/string';
import { toast } from '../../modules/toast';
import { message } from '../../message';
import { getItem, submit } from '../../structure/json/delete';
import PageHeader from '../../components/page/header/index.vue';
import ConfirmDelete from '../../components/forms/confirm-delete/index.vue';
import Loading from '../../components/etc/loading.vue';

const router = useRouter();
const route = useRoute();
const fields = reactive({
  title: '',
  description: printf(message.words.warningDeleteItem, message.word.json),
  name: '',
});
const loading = ref(true);
const processing = ref(false);

async function onSubmit()
{
  try
  {
    processing.value = true;
    await submit(Number(route.params.srl));
    processing.value = false;
    await router.push('../../');
    toast.add(printf(message.success.delete, message.word.json), 'success');
  }
  catch (e)
  {
    err(['/pages/json/delete.vue', 'onSubmit()'], 'error', e.message);
    processing.value = false;
    toast.add(printf(message.fail.delete, message.word.json), 'error');
  }
}

onMounted(async () => {
  try
  {
    let res = await getItem(Number(route.params.srl));
    fields.title = printf(message.confirm.deleteItem, res.name);
    fields.name = `${message.words.deleteItem}: ${res.name}`;
    loading.value = false;
  }
  catch (e)
  {
    err(['/pages/json/delete.vue', 'onMounted()'], 'error', e.message);
    throw e.message;
  }
});
</script>
