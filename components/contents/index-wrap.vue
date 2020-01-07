<template>
<div :class="['index', type && `index--${type}`]" :style="computedStyle">
  <slot/>
</div>
</template>

<script>
export default {
  name: 'index-wrap',
  props: {
    column: { type: Number, default: 4 },
    type: { type: String, default: null }, // grid,brick
  },
  computed: {
    computedStyle()
    {
      let style = {};
      switch (this.type)
      {
        case 'grid':
          style['grid-template-columns'] = `repeat(${this.column},1fr)`;
          break;
        case 'brick':
          style['column-count'] = `${this.column}`;
          break;
        default:
          break;
      }
      return style;
    },
  },
}
</script>

<style src="./index-wrap.scss" lang="scss" scoped/>
