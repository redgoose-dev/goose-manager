<template>
<article>
  <PageHeader module="apps" title="Delete App"/>
  <ConfirmDelete
    :title="fields.title"
    :description="fields.description"
    :name="fields.name"
    button-label="Delete App"
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
  description: '이것을 삭제하면 하위의 `Nest`, `Article`, `Category`, `File`의 데이터가 전부 삭제됩니다.',
  name: '',
});
const processing = ref(false);

async function onSubmit()
{
  try
  {
    processing.value = true;
    await post(`/apps/${route.params.srl}/delete/`);
    processing.value = false;
    await router.push('../../');
    toast.add(printf(message.success.delete, message.word.app), 'success');
  }
  catch (e)
  {
    err(['pages', 'apps', 'delete.vue', 'onSubmit()'], 'error', e.message);
    processing.value = false;
    toast.add(printf(message.fail.delete, message.word.app), 'error');
  }
}

onMounted(async () => {
  try
  {
    let res = await get(`/apps/${route.params.srl}/`, { field: 'id,name' });
    res = res.data;
    fields.title = printf(message.confirm.deleteItem, res.name);
    fields.name = `[${res.id}] ${res.name}`;
  }
  catch (e)
  {
    err(['pages', 'apps', 'delete.vue', 'onMounted()'], 'error', e.message);
    throw new Error(e.message);
  }
});
</script>
