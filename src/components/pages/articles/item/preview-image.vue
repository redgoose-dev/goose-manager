<template>
<figure class="preview" @click="emits('close')">
  <img :src="props.src" alt="" class="preview__image">
</figure>
</template>

<script setup>
const props = defineProps({
  src: String,
});
const emits = defineEmits([ 'close' ]);
</script>

<style lang="scss" scoped>
@use '../../../../assets/scss/mixins';
.preview {
  margin: 0;
  box-shadow: 0 0 0 1px rgb(255 255 255 / 50%), 0 4px 30px rgb(var(--color-base-rgb) / 25%);
  cursor: zoom-out;
  border-radius: 2px;
  &__image {
    display: block;
    max-width: 85vw;
    max-height: 85vh;
    border-radius: 2px;
    box-sizing: border-box;
  }
  @include mixins.dark-mode() {
    box-shadow: 0 0 0 1px rgb(0 0 0 / 50%), 0 4px 30px rgb(0 0 0 / 25%);
  }
}
</style>
