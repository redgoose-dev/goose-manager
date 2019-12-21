<template>
<span class="image-empty">
  <icon :name="icon" class="image-empty__icon"/>
</span>
</template>

<script>
import icons from '~/components/icon/svg-index';

export default {
  name: 'image-empty',
  components: {
    'icon': () => import('~/components/icon'),
  },
  data()
  {
    return {
      icon: icons[Math.floor(Math.random() * icons.length)],
    };
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/variables";
.image-empty {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: mix($color-blur, #fff, 25%);
  &__icon {
    display: block;
    width: 36px;
    height: 36px;
    stroke-width: 1.25;
    color: #fff;
  }
}
</style>
