<template>
<p class="description">
  <slot/>
</p>
</template>

<style lang="scss" scoped>
@use '../../../scss/mixins';
.description {
  font-size: 11px;
  line-height: 1.25;
  color: var(--color-weak);
  @include mixins.text-single-line();
}
</style>
