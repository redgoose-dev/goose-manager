<template>
  <nav class="toolbar">
    <div class="toolbar__column">
      <slot name="left"/>
    </div>
    <div class="toolbar__column">
      <slot name="right"/>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@use '../../../assets/scss/mixins';

.toolbar {
  display: grid;
  align-items: center;
  justify-content: space-between;
  grid-template-columns: auto auto;
  box-sizing: border-box;
  &__column {
    display: flex;
    align-items: center;
    gap: 8px;
    &:first-child {
      justify-self: start;
    }
    &:last-child {
      justify-self: end;
    }
  }
}
</style>
