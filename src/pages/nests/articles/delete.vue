<template>
<article>
  <PageHeader module="articles" title="Delete article"/>
</article>
</template>

<script setup>
import { useRoute } from 'vue-router';
import PageHeader from '../../../components/page/header/index.vue';

const route = useRoute();
</script>
