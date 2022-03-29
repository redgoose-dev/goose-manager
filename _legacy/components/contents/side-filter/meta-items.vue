<template>
<ul class="meta-items">
  <li v-for="(item,key) in items">
    <strong>{{item.label}}</strong>
    <em>{{item.value}}</em>
  </li>
</ul>
</template>

<script>
export default {
  name: 'side-filter-meta-items',
  props: {
    items: { type: Array, required: true },
  },
}
</script>

<style lang="scss" scoped>
.meta-items {
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    display: block;
    &:nth-child(n+2) {
      margin-top: 16px;
    }
  }
  strong {
    display: block;
    font-size: 12px;
    font-weight: 400;
    color: var(--color-blur);
    line-height: 1.25;
  }
  em {
    display: block;
    font-style: normal;
    font-family: var(--font-eng-circular);
    font-size: 16px;
    word-break: break-all;
    font-weight: 600;
    line-height: 1.42;
  }
}
</style>
