<template>
<nav class="side-menu">
  <router-link to="/preference/">
    <span>Basic</span>
    <Icon name="chevron-right"/>
  </router-link>
  <router-link to="/preference/dashboard/">
    <span>Dashboard</span>
    <Icon name="chevron-right"/>
  </router-link>
  <router-link to="/preference/navigation/">
    <span>Navigation</span>
    <Icon name="chevron-right"/>
  </router-link>
  <router-link to="/preference/nest/">
    <span>Nest</span>
    <Icon name="chevron-right"/>
  </router-link>
  <router-link to="/preference/article/">
    <span>Article</span>
    <Icon name="chevron-right"/>
  </router-link>
  <router-link to="/preference/file/">
    <span>File</span>
    <Icon name="chevron-right"/>
  </router-link>
  <router-link to="/preference/checklist/">
    <span>Checklist</span>
    <Icon name="chevron-right"/>
  </router-link>
</nav>
</template>

<script setup>
import Icon from '../../icon/index.vue'
</script>

<style src="./side-menu.scss" lang="scss" scoped></style>
