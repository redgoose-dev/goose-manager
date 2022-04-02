<template>
<div class="group">
  <slot/>
</div>
</template>

<style lang="scss" scoped>
@use '../../../assets/scss/mixins';
.group {
  display: flex;
  align-items: center;
  height: 34px;
  box-sizing: border-box;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgb(var(--group-color-line, 180 180 180));
  @include mixins.dark-mode() {
    box-shadow: 0 0 0 1px rgb(var(--group-color-line, 90 90 90 / 100%));
  }
}
</style>
