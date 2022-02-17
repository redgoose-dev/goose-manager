<template>
<article>
  <PageHeader module="users" title="Delete User"/>
  <ConfirmDelete
    :title="fields.title"
    :description="fields.description"
    :name="fields.name"
    button-label="Delete User"
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
import { printf, words } from '../../libs/message';
import PageHeader from '../../components/page/header/index.vue';
import ConfirmDelete from '../../components/forms/confirm-delete/index.vue';

const router = useRouter();
const route = useRoute();
const fields = reactive({
  title: '',
  description: printf(words.warningDeleteItem, '사용자'),
  name: '',
});
const processing = ref(false);

async function onSubmit()
{
  try
  {
    processing.value = true;
    await post(`/users/${route.params.srl}/delete/`);
    processing.value = false;
    await router.push('../../');
    toast.add('Success delete user.', 'success');
  }
  catch (e)
  {
    err(['pages', 'users', 'delete.vue', 'onSubmit()'], 'error', e.message);
    processing.value = false;
    toast.add('Failed delete app.', 'error');
  }
}

onMounted(async () => {
  try
  {
    let res = await get(`/users/${route.params.srl}/`, { field: '*' });
    res = res.data;
    fields.title = printf(words.confirmDeleteItem, `사용자(${res.name})`);
    fields.name = `${res.email}`;
  }
  catch (e)
  {
    err(['pages', 'users', 'delete.vue', 'onMounted()'], 'error', e.message);
    toast.add('Failed load user item.', 'error');
    await router.back();
  }
});
</script>

<style lang="scss" scoped>

</style>
