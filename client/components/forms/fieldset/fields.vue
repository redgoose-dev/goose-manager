<template>
<div class="fields">
  <slot/>
</div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.fields {
  display: flex;
  align-items: center;
  :deep(> .field) {
    flex: 1;
  }
}
</style>
