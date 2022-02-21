<template>
<article>
  <PageHeader module="json" title="JSON Items"/>
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
        { label: 'Delete', href: `./${item.srl}/delete/` },
      ]"/>
  </Items>
  <Empty v-else/>
  <Controller>
    <template #right>
      <ButtonBasic href="./create/" color="key" icon-left="plus">
        Create JSON
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { err } from '../../libs/error';
import getData from '../../structure/json';
import PageHeader from '../../components/page/header/index.vue';
import { Items, Card } from '../../components/item';
import Controller from '../../components/forms/fieldset/controller.vue';
import ButtonBasic from '../../components/button/basic.vue';
import Loading from '../../components/etc/loading.vue';
import Empty from '../../components/error/empty.vue';

const loading = ref(false);
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
    err(['pages', 'json', 'index.vue', 'onMounted()'], 'error', e.message);
    loading.value = false;
  }
});
</script>
