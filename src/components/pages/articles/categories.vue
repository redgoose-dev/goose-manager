<template>
<nav class="categories">
  <ul>
    <li v-for="item in items">
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
  items: Array,
});
</script>

<style lang="scss" scoped>
.categories {
  margin: 0 0 16px 0;
  user-select: none;
  ul {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    column-gap: 16px;
    row-gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    display: block;
  }
  a {
    display: flex;
    align-items: center;
    margin: -4px -8px;
    padding: 4px 8px;
    color: var(--color-text, var(--color-weak));
    font-size: 12px;
    font-weight: 500;
    line-height: 1.25;
    text-decoration: none;
    &:hover {
      --color-text: var(--color-base);
    }
    &.active {
      cursor: default;
      &,
      &:hover {
        --color-text: var(--color-key);
      }
    }
    em {
      margin-left: 2px;
      font-style: normal;
      &:before {
        content: '(';
      }
      &:after {
        content: ')';
      }
    }
  }
}
</style>
