<template>
<article>
  <PageHeader module="users"/>
  <Loading v-if="processing"/>
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
import store from '../../store';
import getData from '../../structure/users';
import { err } from '../../libs/error';
import { Items, Card, Mark } from '../../components/item';
import PageHeader from '../../components/page/header/index.vue';
import Controller from '../../components/forms/fieldset/controller.vue';
import ButtonBasic from '../../components/button/basic.vue';
import Loading from '../../components/etc/loading.vue';
import Empty from '../../components/error/empty.vue';

const processing = ref(false);
const index = ref(null);
const total = ref(0);

onMounted(async () => {
  try
  {
    processing.value = true;
    let res = await getData();
    total.value = res.total;
    index.value = res.index;
    processing.value = false;
  }
  catch (e)
  {
    err(['pages', 'apps', 'index.vue', 'onMounted()'], 'error', e.message);
    processing.value = false;
  }
});
</script>
