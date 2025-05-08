<template>
<span class="empty-image">
  <Icon :name="iconName"/>
</span>
</template>

<script setup>
import { ref } from 'vue'
import { iconRandomPick } from '../../icon/map.js'
import Icon from '../../icon/index.vue'

const iconName = ref(iconRandomPick())
</script>

<style lang="scss" scoped>
@use '../../../scss/mixins';
.empty-image {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  width: var(--image-empty-width, auto);
  height: var(--image-empty-height, 100%);
  min-height: var(--image-empty-min-height, unset);
  max-height: var(--image-empty-max-height, unset);
  box-sizing: border-box;
  background-color: var(--image-empty-bg, mixins.mix-alpha(var(--color-base), 25%));
  --icon-size: 32px;
  --icon-color: var(--color-edge);
  --icon-stroke: 1.5;
}
</style>
