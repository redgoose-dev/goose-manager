<template>
<div class="index" :style="computedStyle">
  <slot/>
</div>
</template>

<script>
export default {
  name: 'index-wrap',
  props: {
    column: { type: Number, default: undefined }, // 1~8
    gap: { type: Number, default: undefined }, // 1~8
  },
  computed: {
    computedStyle()
    {
      let style = {};
      if (this.column !== undefined)
      {
        style['grid-template-columns'] = `repeat(${this.column},1fr)`;
      }
      if (this.gap !== undefined)
      {
        style['grid-gap'] = `${this.gap}px`;
      }
      return style;
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables";
@import "../../assets/scss/mixins";

.index {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  grid-gap: 16px;
}
</style>
