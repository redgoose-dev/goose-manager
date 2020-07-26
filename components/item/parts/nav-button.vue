<template>
<nav class="nav-button">
  <button-basic
    v-for="(item,key) in items"
    :key="key"
    :href="item.link"
    :inline="true"
    :color="item.color"
    size="small"
    class="nav-button__item">
    {{item.label}}
  </button-basic>
</nav>
</template>

<script>
export default {
  name: 'nav-button',
  components: {
    'button-basic': () => import('~/components/button/basic'),
  },
  props: {
    items: { type: Array, default: [] },
  },
}
</script>

<style lang="scss" scoped>
.nav-button {
  display: flex;
  align-items: center;
  &__item {
    &:nth-child(n+2) {
      margin-left: 4px;
    }
  }
}
</style>
