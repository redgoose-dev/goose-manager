<template>
<nav class="category-tab">
  <ul>
    <li v-for="o in props.items">
      <router-link
        :to="o.link"
        :class="[ props.active === o.srl && 'active' ]">
        <span>{{o.label}}</span>
        <em>{{o.count}}</em>
      </router-link>
    </li>
  </ul>
</nav>
</template>

<script setup>
const props = defineProps({
  items: Array, // { srl, link, label, count }
  active: [ String, Number ],
})
</script>

<style src="./category-tab.scss" lang="scss" scoped></style>
