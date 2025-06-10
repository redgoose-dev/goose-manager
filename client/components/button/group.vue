<template>
<div class="button-group">
  <slot/>
</div>
</template>

<script setup>
const props = defineProps({
  size: String, // small
})
</script>

<style lang="scss" scoped>
@use '../../scss/mixins';
.button-group {
  display: flex;
  gap: 0 1px;
  & > :is(.button):not(:first-child, :last-child) {
    &, :is(.button) {
      border-radius: 0;
    }
  }
  & > :is(.button):first-child,
  & > :is(:first-child) :is(.button) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  & > :is(.button):last-child,
  & > :is(:last-child) :is(.button) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>
