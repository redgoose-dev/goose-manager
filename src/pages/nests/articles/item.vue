<template>
<Item
  :srl="Number(route.params.articleSrl)"
  :nest-srl="Number(route.params.nestSrl)"/>
</template>

<script setup>
import Item from '../../../components/pages/articles/item/index.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
