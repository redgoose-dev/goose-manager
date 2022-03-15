<template>
<article>
  <PageHeader module="apps"/>
  <Loading v-if="loading"/>
  <Items v-else-if="index?.length > 0">
    <Card
      v-for="item in index"
      :title="item.title"
      :description="item.description"
      :meta="item.meta"
      :nav="[
        { label: 'Edit', href: `./${item.srl}/edit/` },
        { label: 'Delete', href: `./${item.srl}/delete/` },
      ].filter(Boolean)"
      class="item"/>
  </Items>
  <Empty v-else/>
  <Controller>
    <template #right>
      <ButtonBasic href="./create/" color="key" icon-left="plus">
        Create App
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import getData from '../../structure/apps';
import { err } from '../../libs/error';
import { Items, Card } from '../../components/item';
import PageHeader from '../../components/page/header/index.vue';
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
  catch(e)
  {
    err(['pages', 'apps', 'index.vue', 'onMounted()'], 'error', e.message);
    throw e.message;
  }
});
</script>

<style lang="scss" scoped>
.item {
  --item-height: 110px;
}
</style>
