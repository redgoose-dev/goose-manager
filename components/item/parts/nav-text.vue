<template>
<nav class="nav-text">
  <nuxt-link
    v-for="(item,key) in items"
    v-if="item.link"
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
<style lang="scss" scoped>
@import "../../../assets/scss/variables";

.nav-text {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  user-select: none;
  > a {
    display: block;
    font-family: $font-eng-circular;
    font-size: 12px;
    font-weight: 600;
    color: var(--color-base);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
    &:nth-child(n+2) {
      margin-left: 10px;
    }
  }
}
</style>
