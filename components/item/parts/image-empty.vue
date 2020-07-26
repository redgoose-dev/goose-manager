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

<style src="./image-empty.scss" lang="scss" scoped/>
