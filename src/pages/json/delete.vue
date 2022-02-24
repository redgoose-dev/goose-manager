<template>
<article>
  <PageHeader module="json" title="Delete JSON"/>
  <Loading v-if="loading"/>
  <ConfirmDelete
    v-else
    :title="fields.title"
    :description="fields.description"
    button-label="Delete JSON"
    :processing="processing"
    @cancel="$router.back()"
    @submit="onSubmit"/>
</article>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { get, post } from '../../libs/api';
import { err } from '../../libs/error';
import { printf } from '../../libs/string';
import { toast } from '../../modules/toast';
import { message } from '../../message';
import PageHeader from '../../components/page/header/index.vue';
import ConfirmDelete from '../../components/forms/confirm-delete/index.vue';
import Loading from '../../components/etc/loading.vue';

const router = useRouter();
const route = useRoute();
const fields = reactive({
  title: '',
  description: printf(message.words.warningDeleteItem, 'JSON'),
  name: '',
});
const loading = ref(true);
const processing = ref(false);

async function onSubmit()
{
  try
  {
    processing.value = true;
    await post(`/json/${route.params.srl}/delete/`);
    processing.value = false;
    await router.push('../../');
    toast.add(printf(message.success.delete, 'JSON'), 'success');
  }
  catch (e)
  {
    err(['pages', 'json', 'delete.vue', 'onSubmit()'], 'error', e.message);
    processing.value = false;
    toast.add(printf(message.fail.delete, 'JSON'), 'error');
  }
}

onMounted(async () => {
  try
  {
    loading.value = true;
    let res = await get(`/json/${route.params.srl}/`, { field: 'name' });
    fields.title = printf(message.confirm.deleteItem, res.data.name);
    loading.value = false;
  }
  catch (e)
  {
    err(['pages', 'json', 'delete.vue', 'onMounted()'], 'error', e.message);
    loading.value = false;
    throw new Error(e.message);
  }
});
</script>
