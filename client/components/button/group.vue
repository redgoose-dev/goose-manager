<template>
<div class="button-group">
  <slot/>
</div>
</template>

<style lang="scss" scoped>
@use '../../scss/mixins';
.button-group {
  display: flex;
  gap: 0 1px;
  & > :not(:first-child):is(.button, .button-icon),
  & > :not(:first-child) :is(.button, .button-icon) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  & > :not(:last-child):is(.button, .button-icon),
  & > :not(:last-child) :is(.button, .button-icon) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>
