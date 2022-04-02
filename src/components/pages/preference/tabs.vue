<template>
<nav class="tabs">
  <router-link v-for="o in tree" :to="o.to" class="tabs__link">
    <strong>{{o.label}}</strong>
    <Icon name="chevron-right"/>
  </router-link>
</nav>
</template>

<script setup>
import { ref } from 'vue';
import Icon from '../../icons/index.vue';

const tree = ref([
  { label: 'General', to: '/preference/' },
  { label: 'Dashboard', to: '/preference/dashboard/' },
  { label: 'Navigation', to: '/preference/navigation/' },
  { label: 'Nests', to: '/preference/nests/' },
  { label: 'Articles', to: '/preference/articles/' },
  { label: 'Files', to: '/preference/files/' },
  { label: 'Checklist', to: '/preference/checklist/' },
]);
</script>

<style src="./tabs.scss" lang="scss" scoped></style>
