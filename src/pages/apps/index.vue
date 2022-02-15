<template>
<article>
  <PageHeader module="apps"/>
  <Loading v-if="processing"/>
  <Items v-else-if="index?.length > 0">
    <Card
      v-for="item in index"
      :title="item.title"
      :description="item.description"
      :meta="item.meta"
      :nav="[
        { label: 'Edit', href: `./${item.srl}/edit/` },
        { label: 'Delete', href: `./${item.srl}/delete/` },
      ]"
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
import PageHeader from '../../components/page/header/index.vue';
import { Items, Card } from '../../components/item';
import Controller from '../../components/forms/fieldset/controller.vue';
import ButtonBasic from '../../components/button/basic.vue';
import Loading from '../../components/etc/loading.vue';
import Empty from '../../components/error/empty.vue';

const processing = ref(false);
const index = ref(null);
const pagination = ref(null);

async function fetch()
{
  try
  {
    processing.value = true;
    let res = await getData();
    pagination.value = { total: res.total };
    index.value = res.index;
    processing.value = false;
  }
  catch(e)
  {
    processing.value = false;
  }
}

onMounted(async () => fetch());
</script>

<style lang="scss" scoped>
.item {
  --item-height: 110px;
}
</style>
