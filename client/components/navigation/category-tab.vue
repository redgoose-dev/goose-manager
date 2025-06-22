<template>
<nav class="category-tab">
  <ul>
    <li v-for="o in props.items">
      <a
        :href="o.link"
        :class="[ props.active === o.srl && 'active' ]"
        @click="emits('select', o, $event)">
        <span>{{o.label}}</span>
        <em>{{o.count}}</em>
      </a>
    </li>
  </ul>
</nav>
</template>

<script setup>
const props = defineProps({
  items: Array, // { srl, link, label, count }
  active: [ String, Number ],
})
const emits = defineEmits([ 'select' ])
</script>

<style src="./category-tab.scss" lang="scss" scoped></style>
