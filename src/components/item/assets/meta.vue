<template>
<p class="meta">
  <span v-for="item in props.items">
    {{item}}
  </span>
</p>
</template>

<script setup>
const props = defineProps({
  items: Array,
});
</script>

<style lang="scss" scoped>
.meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  span {
    display: block;
    font-size: 10px;
    color: var(--color-weak);
    line-height: 1.25;
    &:nth-child(n+2):before {
      content: ',';
      padding-right: 4px;
    }
  }
}
</style>
