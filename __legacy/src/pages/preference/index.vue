<template>
<article>
  <PageHeader module="preference"/>
  <div class="preference">
    <div class="preference__body">
      <General v-if="isHome"/>
      <router-view v-else/>
    </div>
    <aside class="preference__side">
      <Tabs/>
    </aside>
  </div>
</article>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '../../components/page/header/index.vue'
import Tabs from '../../components/pages/preference/tabs.vue'
import General from './general.vue'

const route = useRoute()
const isHome = computed(() => (route.name === 'Preference'))
</script>

<style lang="scss" scoped>
.preference {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px;
  gap: 40px;
  &__side {
    position: relative;
  }
}
</style>
