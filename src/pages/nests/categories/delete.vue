<template>
<article>
  <PageHeader module="categories" title="Delete category"/>
  <Loading v-if="loading"/>
  <ConfirmDelete
    v-else
    :title="fields.title"
    :description="fields.description"
    :name="fields.name"
    button-label="Delete category"
    :processing="processing"
    @cancel="$router.back()"
    @submit="onSubmit"/>
</article>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { err } from '../../../libs/error';
import { toast } from '../../../modules/toast';
import { printf } from '../../../libs/string';
import { message } from '../../../message';
import { getItem, submit } from '../../../structure/categories/delete';
import PageHeader from '../../../components/page/header/index.vue';
import ConfirmDelete from '../../../components/forms/confirm-delete/index.vue';
import Loading from '../../../components/etc/loading.vue';

const router = useRouter();
const route = useRoute();
const fields = reactive({
  title: printf(message.confirm.deleteItem, message.word.category),
  description: printf(message.words.warningDeleteItem, message.word.category),
  name: '',
});
const loading = ref(true);
const processing = ref(false);

async function onSubmit()
{
  try
  {
    processing.value = true;
    await submit(Number(route.params.categorySrl));
    processing.value = false;
    await router.push('../../');
    toast.add(printf(message.success.delete, message.word.category), 'success');
  }
  catch (e)
  {
    err(['pages', 'nests', 'categories', 'delete.vue', 'onSubmit()'], 'error', e.message);
    processing.value = false;
    toast.add(printf(message.fail.delete, message.word.category), 'error');
  }
}

onMounted(async () => {
  try
  {
    loading.value = true;
    let res = await getItem(Number(route.params.categorySrl));
    fields.name = `${message.words.deleteItem}: ${res.srl}`;
    loading.value = false;
  }
  catch (e)
  {
    err(['pages', 'nests', 'categories', 'delete.vue', 'onMounted()'], 'error', e.message);
    loading.value = false;
    throw new Error();
  }
});
</script>
