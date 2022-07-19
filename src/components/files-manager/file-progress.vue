<template>
<div class="progress">
  <Spinner class="progress__spinner"/>
</div>
</template>

<script lang="ts" setup>
import Spinner from '../etc/spinner.vue'
</script>

<style lang="scss" scoped>
@use '../../assets/scss/mixins';
.progress {
  position: relative;
  display: grid;
  place-content: center;
  aspect-ratio: 1 / 1;
  background: rgb(var(--color-base-rgb) / 10%);
  border-radius: 2px;
  overflow: hidden;
  user-select: none;
  &__spinner {
    --spinner-size: 40px;
  }
}
</style>
