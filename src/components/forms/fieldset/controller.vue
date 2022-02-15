<template>
<nav class="controller">
  <div class="controller__left">
    <slot name="left"/>
  </div>
  <div class="controller__right">
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
  margin: 30px 0 0;
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
