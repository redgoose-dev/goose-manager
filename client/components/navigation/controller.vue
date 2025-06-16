<template>
<nav :class="[ 'controller', isCenter && 'is-center' ]">
  <slot v-if="isCenter" name="center"/>
  <template v-else>
    <div class="controller__left">
      <slot name="left"/>
    </div>
    <div class="controller__right">
      <slot name="right"/>
    </div>
  </template>
</nav>
</template>

<script setup>
import { computed } from 'vue'
const slots = defineSlots()

const isCenter = computed(() => (!!slots.center))
</script>

<style lang="scss" scoped>
.controller {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  margin: 54px 0 0;
  &:not(.is-center) {
    justify-content: space-between;
  }
  &:is(.is-center) {
    justify-content: center;
    gap: var(--controller-gap, 6px);
  }
  &__left {
    display: grid;
    grid-auto-flow: column;
    gap: var(--controller-gap, 6px);
  }
  &__right {
    display: grid;
    grid-auto-flow: column;
    gap: var(--controller-gap, 6px);
  }
}
</style>
