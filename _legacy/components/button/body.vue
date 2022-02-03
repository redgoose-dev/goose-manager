<template>
<span class="button-basic__wrap">
  <icon v-if="iconLeft" :name="iconLeft" class="button-basic__icon left"/>
  <em v-if="$slots.default" class="button-basic__label">
    <slot/>
  </em>
  <icon v-if="iconRight" :name="iconRight" class="button-basic__icon right"/>
</span>
</template>

<script>
export default {
  name: 'button-basic-body',
  components: {
    'icon': () => import('~/components/icon'),
  },
  props: {
    iconLeft: { type: String, default: null },
    iconRight: { type: String, default: null },
  },
}
</script>

<style src="./basic.scss" lang="scss" scoped/>
