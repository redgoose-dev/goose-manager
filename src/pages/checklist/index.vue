<template>
<article class="checklist">
  <PageHeader module="checklist"/>
  <div class="checklist__body">
    <Loading v-if="loading"/>
    <ChecklistItem
      v-if="!loading"
      v-model="state.content"
      :date="state.date"
      :today="today"
      :percent="percent"
      @update:modelValue="onUpdateContent"/>
    <Controller>
      <template #left>
        <ButtonBasic href="./list/" icon-left="list">
          List
        </ButtonBasic>
      </template>
      <template #right>
        <ButtonBasic color="key" href="./edit/" icon-left="edit">
          Edit
        </ButtonBasic>
      </template>
    </Controller>
  </div>
  <ChecklistProgress v-if="!loading" :percent="percent"/>
</article>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import store from '../../store';
import { getLastItem, editItem } from '../../structure/checklist/item';
import { checkTime, countingCheckbox } from '../../structure/checklist/lib';
import { err } from '../../libs/error';
import PageHeader from '../../components/page/header/index.vue';
import ButtonBasic from '../../components/button/basic.vue';
import { Controller } from '../../components/navigation';
import ChecklistItem from '../../components/pages/checklist/item.vue';
import ChecklistProgress from '../../components/pages/checklist/progress.vue';
import Loading from '../../components/etc/loading.vue';

const loading = ref(true);
const state = reactive({
  srl: NaN,
  content: '',
  date: '',
  percent: NaN,
});
const today = computed(() => {
  const { preference } = store.state;
  return !checkTime(state.date, preference.checklist.resetTime);
});
const percent = computed(() => {
  if (!state.content) return 0;
  const { percent } = countingCheckbox(state.content);
  return percent;
});

async function onUpdateContent(str)
{
  await editItem(state.srl, str);
}

onMounted(async () => {
  try
  {
    let res = await getLastItem();
    state.srl = res.srl;
    state.content = res.content;
    state.date = res.date;
    state.percent = res.percent;
    loading.value = false;
  }
  catch (e)
  {
    err([ 'components', 'pages', 'checklist', 'index.vue', 'onMounted()' ], 'error', e.message);
    throw e.message;
  }
});
</script>

<style lang="scss" scoped>
.checklist {
  &__body {
    margin: 0 auto;
    max-width: 800px;
  }
}
</style>
