<template>
<nav class="category-tab">
  <ul>
    <li v-for="o in props.items">
      <router-link :to="o.link" :class="[ o.active && 'active' ]">
        <span>{{o.label}}</span>
        <em>{{o.count}}</em>
      </router-link>
    </li>
  </ul>
</nav>
</template>

<script setup>
const props = defineProps({
  items: Array, // { label, link, count, active }
})
</script>

<style src="./category-tab.scss" lang="scss" scoped></style>
