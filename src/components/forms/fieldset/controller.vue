<template>
<nav class="controller">
  <div v-if="$slots.left" class="controller__left">
    <slot name="left"/>
  </div>
  <div v-if="$slots.right" class="controller__right">
    <slot name="right"/>
  </div>
</nav>
</template>

<style lang="scss" scoped>
.controller {
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  &__left {
    display: grid;
    grid-auto-flow: column;
    gap: 10px;
  }
  &__right {
    display: grid;
    grid-auto-flow: column;
    gap: 10px;
  }
}
</style>
