<template>
<nav class="tabs">
  <router-link v-for="o in tree" :to="o.to" class="tabs__link">
    <strong>{{o.label}}</strong>
    <Icon name="chevron-right"/>
  </router-link>
</nav>
</template>

<script setup>
import { ref } from 'vue'
import Icon from '../../icons/index.vue'

const tree = ref([
  { label: '기본', to: '/preference/' },
  { label: '대시보드', to: '/preference/dashboard/' },
  { label: '네비게이션', to: '/preference/navigation/' },
  { label: '둥지', to: '/preference/nests/' },
  { label: '아티클', to: '/preference/articles/' },
  { label: '첨부파일', to: '/preference/files/' },
  { label: '체크리스트', to: '/preference/checklist/' },
])
</script>

<style src="./tabs.scss" lang="scss" scoped></style>
