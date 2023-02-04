<template>
<div class="empty">
  <Icon :name="iconRandomPick()" class="empty__icon"/>
  <p class="empty__message">
    no item
  </p>
</div>
</template>

<script setup>
import { iconRandomPick } from '../../icons/assets';
import Icon from '../../icons/index.vue';
</script>

<style lang="scss" scoped>
@use '../../../assets/scss/mixins';
.empty {
  display: grid;
  align-content: center;
  justify-content: center;
  height: 150px;
  background: rgb(255 255 255);
  border-radius: var(--size-radius);
  box-shadow: 0 0 0 1px rgb(var(--color-base-rgb) / 5%), 0 2px 24px rgb(var(--color-base-rgb) / 15%);
  text-align: center;
  user-select: none;
  &__icon {
    display: block;
    margin: 0 auto;
    --icon-size: 28px;
    --icon-stroke: 1;
    --icon-color: rgb(var(--color-base-rgb) / 100%);
  }
  &__message {
    display: block;
    margin: 4px 0 0;
    color: var(--color-weak);
    font-size: 11px;
    font-weight: 500;
  }

  @include mixins.dark-mode() {
    background: rgb(56 56 56);
    box-shadow: 0 0 0 1px rgb(0 0 0 / 5%), 0 2px 24px rgb(0 0 0 / 15%);
  }
}
</style>
