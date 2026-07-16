<template>
<header class="field-header">
  <h1>
    <slot name="title"/>
  </h1>
  <nav v-if="$slots.nav">
    <slot name="nav"/>
  </nav>
</header>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 10px;
}
h1 {
  display: block;
  margin: 0;
  font-size: 20px;
  line-height: 1.05;
  letter-spacing: -.25px;
  font-weight: 700;
}
</style>
