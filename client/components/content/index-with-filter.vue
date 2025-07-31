<template>
<div class="index-wrap">
  <slot name="content"/>
  <slot name="filter"/>
</div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.index-wrap {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0 30px;
  align-items: start;
}
</style>
