<template>
<figure class="thumbnail-preview">
  <img :src="image" alt="" class="thumbnail-preview__image">
  <button
    type="button"
    title="Close"
    class="thumbnail-preview__close"
    @click="emits('close')">
    <Icon name="x"/>
  </button>
</figure>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { controlWindow } from '../util';
import Icon from '../../icons/index.vue';

const props = defineProps({
  image: String,
});
const emits = defineEmits([ 'close' ]);

onMounted(() => {
  controlWindow(true, 'thumbnail-preview');
});
onUnmounted(() => {
  controlWindow(false, 'thumbnail-preview');
});
</script>

<style lang="scss" scoped>
@use '../../../assets/scss/mixins';
.thumbnail-preview {
  position: relative;
  margin: 0;
  height: 100%;
  overflow: hidden;
  &__image {
    position: absolute;
    left: 50%;
    top: 50%;
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transform: translate(-50%, -50%);
  }
  &__close {
    display: block;
    position: absolute;
    left: 50%;
    bottom: 8%;
    transform: translateX(-50%);
    margin: 0;
    padding: 0;
    font-size: 0;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: none;
    background: var(--color-key);
    box-shadow: 0 0 0 1px rgb(var(--color-invert-rgb) / 50%), 0 3px 15px rgb(var(--color-base-rgb) / 50%);
    @include mixins.button-touch-options(false);
    --icon-color: var(--color-invert);
    --icon-stroke-width: 1.75;
    --icon-size: 28px;
    transition: filter 120ms ease-out;
    svg {
      display: block;
      margin: 0 auto;
    }
    &:hover {
      filter: brightness(120%);
    }
    &:active {
      filter: brightness(110%);
    }
  }
}
</style>
