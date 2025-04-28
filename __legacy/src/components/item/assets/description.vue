<template>
<p class="description">
  <slot/>
</p>
</template>

<style lang="scss" scoped>
@use '../../../assets/scss/mixins';
.description {
  font-size: 11px;
  line-height: 1.42;
  color: var(--color-weak);
  @include mixins.text-single-line();
}
</style>
