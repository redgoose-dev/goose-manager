<template>
<article>
  <PageHeader
    title="[NAME] Articles"
    description="[NEST_DESCRIPTION]"/>
  <div class="articles">
    <div class="articles__body">
      <Loading v-if="loading"/>
      <Items v-else-if="index?.length > 0" theme="card">
        <Card
          v-for="item in index"
          :title="item.title"
          :meta="item.meta"
          :href="`./${item.srl}/`"
          :alt="item.title"
          :image="item.image"
          :nav="[
            { label: 'Edit', href: `./${item.srl}/edit/` },
            { label: 'Delete', href: `./${item.srl}/delete/` },
          ]"/>
      </Items>
      <Empty v-else/>
      <nav>
        .paginate
      </nav>
    </div>
    <aside class="articles__filter">
      .filter
    </aside>
  </div>
  <Controller>
    <template #left>
      <ButtonBasic href="../../" icon-left="cloud">
        Nests
      </ButtonBasic>
      <ButtonBasic href="../categories/" icon-left="server">
        Categories
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic href="./create/" color="key" icon-left="plus">
        Create article
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { err } from '../../../libs/error';
import getData from '../../../structure/articles';
import PageHeader from '../../../components/page/header/index.vue';
import { Items, Card } from '../../../components/item';
import Controller from '../../../components/forms/fieldset/controller.vue';
import ButtonBasic from '../../../components/button/basic.vue';
import Loading from '../../../components/etc/loading.vue';
import Empty from '../../../components/error/empty.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const index = ref(null);
const total = ref(0);

onMounted(async () => {
  try
  {
    loading.value = true;
    let res = await getData(Number(route.params.nestSrl), {
      //
    });
    total.value = res.total;
    index.value = res.articles;
    loading.value = false;
  }
  catch (e)
  {
    err(['pages', 'nests', 'articles', 'index.vue', 'onMounted()'], 'error', e.message);
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.articles {
  display: grid;
  grid-template-columns: 1fr 150px;
  gap: 30px;
  &__body {}
  &__filter {
    position: sticky;
    top: calc(var(--size-header-height) + 16px);
    background: lime;
  }
}
</style>
