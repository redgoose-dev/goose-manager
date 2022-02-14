<template>
<div
  :class="[
    'body',
    props.type === 'full' && 'body--full',
    props.type === 'window' && 'body--window',
  ]"
  @click.stop="">
  <slot/>
</div>
</template>

<script setup>
const props = defineProps({
  type: String,
});
</script>

<style lang="scss" scoped>
.body {
  position: relative;
  cursor: auto;
  background: var(--color-bg);
  box-sizing: border-box;
  &--window {
    border-radius: 2px;
    box-shadow: 0 4px 20px rgb(0 0 0 / 20%), 0 0 0 1px rgb(0 0 0 / 10%);
  }
  &--full {
    width: 100%;
    height: 100%;
  }
}
</style>
