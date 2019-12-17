<template>
<p class="metas">
  <span v-for="(meta,key) in items" v-if="meta" class="metas__item">{{meta}}</span>
</p>
</template>

<script>
export default {
  name: 'metas',
  props: {
    items: { type: Array, default: [] },
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/variables";
.metas {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  &__item {
    display: block;
    font-size: .625rem;
    font-family: $font-eng;
    color: mix($color-blur, #fff, 100%);
    line-height: 1.2;
    &:after {
      content: ', ';
      padding-right: 3px;
    }
    &:last-child {
      &:after {
        content: '';
      }
    }
  }
}
</style>
