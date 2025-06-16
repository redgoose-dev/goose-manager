<template>
<div class="index-wrap">
  <div class="index-wrap__content">
    <slot name="content"/>
  </div>
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
  &__content {
    container-type: inline-size;
  }
}
</style>
