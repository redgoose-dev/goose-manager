<template>
<nav class="item-nav">
  <NavItem
    v-for="item in props.items"
    :href="item.href"
    :target="item.target"
    :click="item.click">
    {{item.label}}
  </NavItem>
</nav>
</template>

<script setup>
import NavItem from './item.vue'

const props = defineProps({
  items: Array,
})
</script>

<style lang="scss" scoped>
.item-nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  user-select: none;
  gap: 8px 12px;
}
</style>
