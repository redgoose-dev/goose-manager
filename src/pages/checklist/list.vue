<template>
<article>
  <PageHeader module="checklist" title="Checklist boards"/>
  <div class="checklist-list">
    <div class="checklist-list__body">
      <Loading v-if="loading" class="checklist-list__loading"/>
      <Items v-else-if="data.index?.length > 0" theme="card">
        <Card
          v-for="item in data.index"
          :title="item.title"
          :href="`/checklist/${item.srl}/`"
          :nav="[
            { label: 'Edit', href: `/checklist/${item.srl}/edit/` },
            { label: 'Delete', href: `/checklist/${item.srl}/delete/` },
          ]">
          <template #after>
            <div :class="[
              'checklist-list__graph',
              item.percent === 100 && 'complete',
            ]">
              <ProgressDonut :radius="30" :stroke="8" :percent="item.percent"/>
              <p>{{item.percent}}%</p>
            </div>
            <Mark v-if="item.today"/>
          </template>
        </Card>
      </Items>
      <Empty v-else/>
      <Pagination
        v-model="page"
        :total="data.total"
        :size="store.state.preference.checklist.pageCount"
        :range="store.state.preference.checklist.pageRange"
        class="checklist-list__paginate"
        @update:modelValue="onChangePage"/>
      <Controller>
        <template #left>
          <ButtonBasic href="../" icon-left="sun" color="key">
            Go to Today
          </ButtonBasic>
        </template>
      </Controller>
    </div>
    <aside class="checklist-list__filter">
      <ChecklistFilter
        :total="data.total"
        :loading="loading"
        @update="onUpdateFilter"/>
    </aside>
  </div>
</article>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import store from '../../store';
import { err } from '../../libs/error';
import { serialize } from '../../libs/string';
import { getData } from '../../structure/checklist/list';
import PageHeader from '../../components/page/header/index.vue';
import { Items, Card, Mark } from '../../components/item';
import { Controller } from '../../components/navigation';
import ButtonBasic from '../../components/button/basic.vue';
import Loading from '../../components/etc/loading.vue';
import Empty from '../../components/error/empty.vue';
import Pagination from '../../components/etc/pagination.vue';
import ProgressDonut from '../../components/etc/progress-donut.vue';
import ChecklistFilter from '../../components/pages/checklist/checklist-filter.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const data = reactive({
  total: 0,
  index: [],
});
const page = ref(route.query.page ? Number(route.query.page) : 1);

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
    if (Number(route.query.page) > 1)
    {
      await router.push('./');
    }
    else
    {
      loading.value = true;
      let res = await getData();
      data.total = res.total;
      data.index = res.index;
      loading.value = false;
    }
  }
  catch (e)
  {
    err(['/pages/checklist/list.vue', 'onUpdateFilter()'], 'error', e.message);
    loading.value = false;
  }
}

onMounted(async () => {
  try
  {
    let res = await getData();
    data.total = res.total;
    data.index = res.index;
    loading.value = false;
  }
  catch (e)
  {
    err(['/pages/checklist/list.vue', 'onMounted()'], 'error', e.message);
    throw e.message;
  }
});
</script>

<style src="./list.scss" lang="scss" scoped></style>
