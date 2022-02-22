<template>
<article>
  <PageHeader module="nests" title="Delete nest"/>
  <ConfirmDelete
    :title="fields.title"
    :description="fields.description"
    :name="fields.name"
    button-label="Delete nest"
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
import { toast } from '../../modules/toast';
import { printf } from '../../libs/string';
import { message } from '../../message';
import PageHeader from '../../components/page/header/index.vue';
import ConfirmDelete from '../../components/forms/confirm-delete/index.vue';

const router = useRouter();
const route = useRoute();
const fields = reactive({
  title: '',
  description: '',
  name: '',
});
const processing = ref(false);

async function onSubmit()
{
  try
  {
    processing.value = true;
    await post(`/nests/${route.params.srl}/delete/`);
    processing.value = false;
    await router.push('../../');
    toast.add(printf(message.success.delete, message.word.nest), 'success');
  }
  catch (e)
  {
    err(['pages', 'nests', 'delete.vue', 'onSubmit()'], 'error', e.message);
    processing.value = false;
    toast.add(printf(message.fail.delete, message.word.nest), 'error');
  }
}

onMounted(async () => {
  try
  {
    let res = await get(`/nests/${route.params.srl}/`, { field: 'id,name' });
    res = res.data;
    fields.title = printf(message.confirm.deleteItem, message.word.nest);
    fields.description = '이것을 삭제하면 하위의 `Article`, `Category`, `File`의 데이터가 삭제됩니다.';
    fields.name = `[${res.id}] ${res.name}`;
  }
  catch (e)
  {
    err(['pages', 'nests', 'delete.vue', 'onMounted()'], 'error', e.message);
    toast.add(printf(message.fail.get, message.word.user), 'error');
    await router.back();
  }
});
</script>
