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
      <Items
        v-else-if="data.index?.length > 0"
        :theme="store.state.filters.articles.theme"
        class="articles__index">
        <component
          :is="itemComponent"
          v-for="item in data.index"
          :title="item.title"
          :meta="item.meta"
          :href="`./${item.srl}/`"
          :alt="item.title"
          :image="item.image"
          :nav="[
            { label: 'Edit', href: `./${item.srl}/edit/${createQueries(['category','page'], route.query)}` },
            { label: 'Delete', href: `./${item.srl}/delete/${createQueries(['category','page'], route.query)}` },
          ]">
          <template v-if="item.private" #after>
            <Mark/>
          </template>
        </component>
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
          <ButtonBasic
            :href="`./create/${createQueries(['category'], route.query)}`"
            color="key"
            icon-left="plus">
            Create article
          </ButtonBasic>
        </template>
      </Controller>
    </div>
    <aside class="articles__filter">
      <ArticleFilter
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
import store from '../../../store-legacy';
import { err } from '../../../libs/error';
import { serialize } from '../../../libs/string';
import { createQueries } from '../../../components/pages/articles/libs';
import { getData, requestArticles, requestCategories } from '../../../structure/articles';
import PageHeader from '../../../components/page/header/index.vue';
import { Items, Card, Thumbnail, Mark } from '../../../components/item';
import { Controller } from '../../../components/navigation';
import ButtonBasic from '../../../components/button/basic.vue';
import Loading from '../../../components/etc/loading.vue';
import Empty from '../../../components/error/empty.vue';
import Categories from '../../../components/pages/articles/categories.vue';
import Pagination from '../../../components/etc/pagination.vue';
import ArticleFilter from '../../../components/pages/articles/article-filter.vue';

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
const loading = ref(true);
const page = ref(route.query.page ? Number(route.query.page) : 1);
const itemComponent = computed(() => {
  switch (store.state.filters.articles.theme)
  {
    case 'list':
    case 'card':
      return Card;
    case 'thumbnail':
    case 'brick':
      return Thumbnail;
  }
  return Card;
});

/**
 * on change page
 * @param {number} page
 */
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
    err(['/pages/nests/articles/index.vue', 'onUpdateFilter()'], 'error', e.message);
    loading.value = false;
  }
}

onMounted(async () => {
  try
  {
    let res = await getData();
    data.total = res.total;
    data.index = res.articles;
    data.nest = res.nest;
    data.categories = res.categories;
    loading.value = false;
  }
  catch (e)
  {
    err(['/pages/nests/articles/index.vue', 'onMounted()'], 'error', e.message);
    throw e.message;
  }
});
</script>

<style src="./index.scss" lang="scss" scoped></style>
