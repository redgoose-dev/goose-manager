<template>
<article>
  <PageHeader module="account"/>
  <Tab
    :items="[
      { label: '계정 프로바이더', link: '/auth/account/', icon: 'lock-keyhole' },
      { label: '공개 토큰', link: '/auth/account/token/', icon: 'key-round' },
    ]"
    class="tab"/>
  <router-view/>
</article>
</template>

<script setup>
import PageHeader from '../../components/header/page.vue'
import { Tab } from '../../components/navigation/index.js'
</script>

<style lang="scss" scoped>
.tab {
  margin: 0 0 30px;
}
</style>
