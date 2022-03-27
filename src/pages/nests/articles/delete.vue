<template>
<Delete :srl="Number(route.params.articleSrl)"/>
</template>

<script setup>
import { useRoute } from 'vue-router';
import Delete from '../../../components/pages/articles/delete.vue';

const route = useRoute();
</script>
