<template>
<article>
  <PageHeader module="apps" title="Delete App"/>
  <ConfirmDelete
    :title="fields.title"
    :description="fields.description"
    :name="fields.name"
    button-label="Delete App"
    @cancel="$router.back()"
    @submit="onSubmitDelete"/>
</article>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { get } from '../../libs/api';
import { err } from '../../libs/error';
import { toast } from '../../modules/toast';
import PageHeader from '../../components/page/header/index.vue';
import ConfirmDelete from '../../components/forms/confirm-delete/index.vue';

const router = useRouter();
const route = useRoute();
const props = defineProps({});
const fields = reactive({
  title: '',
  description: '이것을 삭제하면 하위의 `Nest`, `Article`, `Category`, `File`의 데이터가 전부 삭제됩니다.',
  name: '',
});

async function onSubmitDelete()
{
  try
  {
    //
    // await router.push('../../');
  }
  catch (e)
  {
    //
  }
}

onMounted(async () => {
  try
  {
    let res = await get(`/apps/${route.params.srl}/`, { field: 'id,name' });
    res = res.data;
    fields.title = `이 "${res.name} App"을 삭제할까요?`;
    fields.name = `[${res.id}] ${res.name}`;
  }
  catch (e)
  {
    err(['pages', 'apps', 'delete.vue', 'onMounted()'], 'error', e.message);
    toast.add('Failed load app item.', 'error');
    await router.replace('/apps/');
  }
});
</script>
