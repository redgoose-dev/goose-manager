<template>
<article>
  <PageHeader module="preference"/>
  <div class="preference">
    <aside>
      <SideMenu/>
    </aside>
    <router-view/>
  </div>
</article>
</template>

<script setup>
import PageHeader from '../../components/header/page.vue'
import SideMenu from '../../components/pages/preference/side-menu.vue'
</script>

<style lang="scss" scoped>
.preference {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  gap: 0 40px;
  > aside {
    position: relative;
  }
}
</style>
