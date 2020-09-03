<template>
<nav class="nav-text">
  <nuxt-link
    v-for="(item,key) in items"
    v-if="item && item.link"
    :key="key"
    :to="item.link">
    {{item.label}}
  </nuxt-link>
</nav>
</template>

<script>
export default {
  name: 'nav-text',
  props: {
    items: { type: Array, default: null },
  },
}
</script>

<style src="./nav-text.scss" lang="scss" scoped/>
