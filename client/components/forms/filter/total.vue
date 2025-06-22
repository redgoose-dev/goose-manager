<template>
<article class="total">
  <h1>모두</h1>
  <em>{{props.total}}</em>
</article>
</template>

<script setup>
const props = defineProps({
  total: { type: Number, default: 0 },
})
</script>

<style lang="scss" scoped>
.total {
  user-select: none;
  h1 {
    margin: 0 0 4px;
    line-height: 1.05;
    font-size: 12px;
    font-weight: 600;
    color: var(--color-weak);
  }
  em {
    display: block;
    margin: 0;
    font-style: normal;
    font-size: 24px;
    font-weight: 900;
    font-family: var(--font-eng);
    line-height: 1.05;
  }
}
</style>
