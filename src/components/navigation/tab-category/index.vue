<template>
<nav class="categories">
  <ul>
    <li v-for="item in props.items">
      <router-link :to="item.link" :class="[ item.active && 'active' ]">
        <span>{{item.label}}</span>
        <em>{{item.count}}</em>
      </router-link>
    </li>
  </ul>
</nav>
</template>

<script setup>
const props = defineProps({
  items: { type: undefined, required: true },
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
