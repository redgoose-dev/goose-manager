<template>
<article>
  <PageHeader module="checklist" title="Delete board"/>
  <Loading v-if="loading"/>
  <ConfirmDelete
    v-else
    :title="fields.title"
    :description="fields.description"
    :name="fields.name"
    button-label="Delete Board"
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
import { getData, deleteItem } from '../../structure/checklist/delete';
import PageHeader from '../../components/page/header/index.vue';
import ConfirmDelete from '../../components/forms/confirm-delete/index.vue';
import Loading from '../../components/etc/loading.vue';

const router = useRouter();
const route = useRoute();
const fields = reactive({
  title: printf(message.confirm.deleteItem, message.word.board),
  description: printf(message.words.warningDeleteItem, message.word.board),
  name: '',
});
const loading = ref(true);
const processing = ref(false);

async function onSubmit()
{
  try
  {
    processing.value = true;
    await deleteItem(Number(route.params.srl));
    processing.value = false;
    await router.push('../../list/');
    toast.add(printf(message.success.delete, message.word.board), 'success');
  }
  catch (e)
  {
    err(['/pages/checklist/delete.vue', 'onSubmit()'], 'error', e.message);
    processing.value = false;
    toast.add(printf(message.fail.delete, message.word.board), 'error');
  }
}

onMounted(async () => {
  try
  {
    let res = await getData(Number(route.params.srl));
    fields.name = res.regdate;
    loading.value = false;
  }
  catch (e)
  {
    err(['/pages/checklist/delete.vue', 'onMounted()'], 'error', e.message);
    throw e.message;
  }
});
</script>
