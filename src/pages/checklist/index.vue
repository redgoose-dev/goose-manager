<template>
<article>
  <PageHeader module="checklist"/>
  <Loading v-if="loading"/>
  <ChecklistItem v-if="!loading"/>
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
  <ChecklistProgress v-if="!loading"/>
</article>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PageHeader from '../../components/page/header/index.vue';
import ButtonBasic from '../../components/button/basic.vue';
import { Controller } from '../../components/navigation';
import ChecklistItem from '../../components/pages/checklist/item.vue';
import ChecklistProgress from '../../components/pages/checklist/progress.vue';
import Loading from '../../components/etc/loading.vue';

const loading = ref(true);

onMounted(async () => {
  //
});
</script>

<style lang="scss" scoped>
//
</style>
