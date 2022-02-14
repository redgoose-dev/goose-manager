<template>
<span class="empty-image">
  <Icon :name="iconName" class="empty-image__icon"/>
</span>
</template>

<script setup>
import icons from '../../icons/svg-index.json';
import Icon from '../../icons/index.vue';
const iconName = icons[Math.floor(Math.random() * icons.length)];
</script>

<style lang="scss" scoped>
@use '../../../assets/scss/mixins';
.empty-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--image-empty-width, 100%);
  height: var(--image-empty-height, 100%);
  box-sizing: border-box;
  background-color: rgb(213 213 213);
  padding: 30px 0;
  box-shadow: inset 0 -10px 30px rgb(0 0 0 / 5%);
  --icon-size: 32px;
  --icon-color: var(--color-invert);
  --icon-stroke-width: 1.25;
  &__icon {
    display: block;
  }
  @include mixins.dark-mode() {
    // TODO: 다크모드
  }
}
</style>
