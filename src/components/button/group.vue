<template>
<div class="button-group">
  <slot/>
</div>
</template>

<style lang="scss" scoped>
@use '../../assets/scss/mixins';
.button-group {
  display: flex;
  gap: 0 1px;
  border-radius: 2px;
  & :is(.button:focus-visible) {
    position: relative;
  }
  & :is(.button):not(:first-child,:last-child) {
    border-radius: 0;
  }
  & :is(.button):first-child {
    border-radius: var(--button-radius) 0 0 var(--button-radius);
  }
  & :is(.button):last-child {
    border-radius: 0 var(--button-radius) var(--button-radius) 0;
  }
}
</style>
