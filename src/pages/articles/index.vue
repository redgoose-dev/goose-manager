<template>
<article>
  <PageHeader module="articles"/>
  <div class="articles">
    <div class="articles__body">
      <Loading v-if="loading"/>
      <Items
        v-else-if="data.index?.length > 0"
        :theme="store.state.preference.articles.filter.theme"
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
            { label: 'Edit', href: `./${item.srl}/edit/` },
            { label: 'Delete', href: `./${item.srl}/delete/` },
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
import store from '../../store';
import { err } from '../../libs/error';
import { serialize } from '../../libs/string';
import { getData, requestArticles } from '../../structure/articles';
import PageHeader from '../../components/page/header/index.vue';
import { Items, Card, Thumbnail, Mark } from '../../components/item';
import Loading from '../../components/etc/loading.vue';
import Empty from '../../components/error/empty.vue';
import Pagination from '../../components/etc/pagination.vue';
import Filter from '../../components/pages/articles/filter.vue';

const route = useRoute();
const router = useRouter();
const data = reactive({
  total: 0,
  index: null,
});
const loading = ref(false);
const page = ref(route.query.page ? Number(route.query.page) : 1);
const itemComponent = computed(() => {
  switch (store.state.preference.articles.filter.theme)
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
    let res = await requestArticles();
    data.total = res.total;
    data.index = res.index;
    loading.value = false;
  }
  catch (e)
  {
    err(['/pages/articles/index.vue', 'onUpdateFilter()'], 'error', e.message);
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
    loading.value = false;
  }
  catch (e)
  {
    err(['/pages/articles/index.vue', 'onMounted()'], 'error', e.message);
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.articles {
  display: grid;
  grid-template-columns: calc(100% - 150px - 40px) 150px;
  gap: 40px;
  &__index {
    &.items--theme-thumbnail {
      .item {
        --item-image-height: 14vw;
        --item-image-min-height: 120px;
        --item-image-max-height: 180px;
      }
    }
    &.items--theme-brick {
      .item {
        --item-image-height: 150px;
      }
    }
  }
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
  top: calc(var(--size-header-height, 42px) + 16px);
}
</style>
