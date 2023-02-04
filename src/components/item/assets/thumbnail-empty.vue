<template>
<span class="empty-image">
  <Icon :name="iconName" class="empty-image__icon"/>
</span>
</template>

<script setup>
import { iconRandomPick } from '../../icons/assets';
import Icon from '../../icons/index.vue';

const iconName = iconRandomPick();
</script>

<style lang="scss" scoped>
@use '../../../assets/scss/mixins';
.empty-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--image-empty-width, auto);
  height: var(--image-empty-height, 100%);
  min-height: var(--image-empty-min-height, unset);
  max-height: var(--image-empty-max-height, unset);
  box-sizing: border-box;
  background-color: var(--image-empty-bg, rgb(213 213 213));
  padding: 30px 0;
  box-shadow: inset 0 -10px 30px rgb(0 0 0 / 5%);
  --icon-size: 32px;
  --icon-color: var(--color-invert);
  --icon-stroke: 1.25;
  &__icon {
    display: block;
  }
  @include mixins.dark-mode() {
    --image-empty-bg: rgb(85 85 85);
    --icon-color: rgb(170 170 170);
  }
}
</style>
