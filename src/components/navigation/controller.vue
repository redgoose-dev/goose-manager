<template>
<nav :class="[
  'controller',
  isCenter && 'controller--center',
]">
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
  margin: 40px 0 0;
  &:not(.controller--center) {
    justify-content: space-between;
  }
  &:is(.controller--center) {
    justify-content: center;
    gap: 8px;
  }
  &__left {
    display: grid;
    grid-auto-flow: column;
    gap: 8px;
  }
  &__right {
    display: grid;
    grid-auto-flow: column;
    gap: 8px;
  }
}
</style>
