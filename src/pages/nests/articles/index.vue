<template>
<article>
  <PageHeader
    module="articles"
    :title="title"
    :description="description"/>
  <Categories
    v-if="data.categories?.length > 0"
    :items="data.categories"/>
  <div class="articles">
    <div class="articles__body">
      <Loading v-if="loading"/>
      <Items v-else-if="data.index?.length > 0" theme="card">
        <Card
          v-for="item in data.index"
          :title="item.title"
          :meta="item.meta"
          :href="`./${item.srl}/`"
          :alt="item.title"
          :image="item.image"
          :nav="[
            { label: 'Edit', href: `./${item.srl}/edit/` },
            { label: 'Delete', href: `./${item.srl}/delete/` },
          ]">
          <template v-if="item.private" #after>
            <Mark/>
          </template>
        </Card>
      </Items>
      <Empty v-else/>
      <Pagination
        v-model="page"
        :total="data.total"
        :size="store.state.preference.articles.pageCount"
        :range="store.state.preference.articles.pageRange"
        class="articles__pagination"
        @update:modelValue="onChangePage"/>
      <Controller class="articles__controller">
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
            Create
          </ButtonBasic>
        </template>
      </Controller>
    </div>
    <aside class="articles__filter">
      <Filter
        :total="data.total"
        :loading="loading"
        @update="onUpdateFilter"/>
    </aside>
  </div>
</article>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import store from '../../../store';
import { err } from '../../../libs/error';
import { serialize } from '../../../libs/string';
import { getData, requestArticles, requestCategories } from '../../../structure/articles';
import PageHeader from '../../../components/page/header/index.vue';
import { Items, Card, Thumbnail, Mark } from '../../../components/item';
import Controller from '../../../components/forms/fieldset/controller.vue';
import ButtonBasic from '../../../components/button/basic.vue';
import Loading from '../../../components/etc/loading.vue';
import Empty from '../../../components/error/empty.vue';
import Categories from '../../../components/pages/articles/categories.vue';
import Pagination from '../../../components/etc/pagination.vue';
import Filter from '../../../components/pages/articles/filter.vue';

const route = useRoute();
const router = useRouter();
const data = reactive({
  total: 0,
  index: null,
  nest: null,
  categories: null,
});
const title = computed(() => (data.nest ? `[${data.nest.id}] Articles` : undefined));
const description = computed(() => (data.nest ? data.nest.description : undefined));
const loading = ref(false);
const page = ref(route.query.page ? Number(route.query.page) : 1);

// TODO: 테마값 적용

function onChangePage(page)
{
  let params = {
    ...route.query,
    page: page > 1 ? page : undefined,
  };
  router.push(`./${serialize(params, true)}`);
}

async function onUpdateFilter()
{
  try
  {
    loading.value = true;
    let [ articles, categories ] = await Promise.all([
      requestArticles(),
      requestCategories(),
    ]);
    data.total = articles.total;
    data.index = articles.index;
    data.categories = categories;
    loading.value = false;
  }
  catch (e)
  {
    err(['pages', 'nests', 'articles', 'index.vue', 'onUpdateFilter()'], 'error', e.message);
    loading.value = false;
  }
}

onMounted(async () => {
  try
  {
    loading.value = true;
    let res = await getData();
    data.total = res.total;
    data.index = res.articles;
    data.nest = res.nest;
    data.categories = res.categories;
    loading.value = false;
  }
  catch (e)
  {
    err(['pages', 'nests', 'articles', 'index.vue', 'fetch()'], 'error', e.message);
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.articles {
  display: grid;
  grid-template-columns: 1fr 150px;
  gap: 40px;
  &__body {}
  &__filter {}
  &__pagination {
    margin: 30px 0 0;
  }
  &__controller {
    margin-top: 40px;
  }
}
.filter {
  position: sticky;
  top: calc(var(--size-header-height) + 16px);
}
</style>
