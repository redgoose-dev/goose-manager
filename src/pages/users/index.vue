<template>
<article>
  <PageHeader module="users"/>
  <Loading v-if="loading"/>
  <Items v-else-if="index?.length > 0">
    <Card
      v-for="item in index"
      :title="item.title"
      :description="item.description"
      :meta="item.meta"
      :href="`./${item.srl}/`"
      :nav="[
        { label: 'Edit', href: `./${item.srl}/edit/` },
        !item.self && { label: 'Delete', href: `./${item.srl}/delete/` },
        { label: 'Change Password', href: `./${item.srl}/change-password/` },
      ].filter(Boolean)">
      <template v-if="item.self" #after>
        <Mark/>
      </template>
    </Card>
  </Items>
  <Empty v-else/>
  <Controller v-if="store.state.user.admin">
    <template #right>
      <ButtonBasic href="./create/" color="key" icon-left="plus">
        Create User
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import store from '../../store-legacy';
import getData from '../../structure/users';
import { err } from '../../libs/error';
import PageHeader from '../../components/page/header/index.vue';
import { Items, Card, Mark } from '../../components/item';
import { Controller } from '../../components/navigation';
import ButtonBasic from '../../components/button/basic.vue';
import Loading from '../../components/etc/loading.vue';
import Empty from '../../components/error/empty.vue';

const loading = ref(true);
const index = ref(null);
const total = ref(0);

onMounted(async () => {
  try
  {
    loading.value = true;
    let res = await getData();
    total.value = res.total;
    index.value = res.index;
    loading.value = false;
  }
  catch (e)
  {
    err(['/pages/users/index.vue', 'onMounted()'], 'error', e.message);
    loading.value = false;
  }
});
</script>
