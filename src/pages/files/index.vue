<template>
<article>
  <PageHeader module="files"/>
  <Loading v-if="loading"/>
  <Items v-else-if="index.length > 0" theme="brick" class="files-index">
    <Thumbnail
      v-for="item in index"
      :href="item.href"
      target="_blank"
      :image="item.image"
      :title="item.title"
      :alt="item.title"
      :meta="item.meta"/>
  </Items>
  <Empty v-else/>
  <Pagination
    v-model="page"
    :total="total"
    :size="store.state.preference.files.pagePerSize"
    :range="10"
    @update:modelValue="onChangePage"/>
</article>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import store from '../../store';
import { err } from '../../libs/error';
import { getItems } from '../../structure/files';
import PageHeader from '../../components/page/header/index.vue';
import { Items, Thumbnail } from '../../components/item';
import Pagination from '../../components/etc/pagination.vue';
import Loading from '../../components/etc/loading.vue';
import Empty from '../../components/error/empty.vue';
import { serialize } from "../../libs/string.js";

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const index = ref([]);
const total = ref(0);
const page = ref(route.query.page ? Number(route.query.page) : 1);

function onChangePage(page)
{
  let params = {
    ...route.query,
    page: page > 1 ? page : undefined,
  };
  router.push(`./${serialize(params, true)}`);
}

onMounted(async () => {
  try
  {
    let res = await getItems();
    total.value = res.total;
    index.value = res.index;
    loading.value = false;
  }
  catch (e)
  {
    err(['/pages/files/index.vue', 'onMounted()'], 'error', e.message);
    throw e.message;
  }
});
</script>

<style lang="scss" scoped>
.files-index {
  --image-empty-height: 15vw;
  --image-empty-min-height: 150px;
  --image-empty-max-height: 200px;
}
.pagination {
  margin: 30px 0 0;
}
</style>
