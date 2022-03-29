<template>
<section class="side-filter-section">
  <h3 class="side-filter-section__title">
    <label v-if="name" :for="name">{{label}}</label>
    <span v-else>{{label}}</span>
  </h3>
  <div class="side-filter-section__body">
    <slot/>
  </div>
</section>
</template>

<script>
export default {
  name: 'side-filter-section',
  props: {
    label: { type: String, default: 'title' },
    name: { type: String },
  },
}
</script>

<style lang="scss" scoped>
.side-filter-section {
  &:nth-child(n+2) {
    margin-top: 24px;
  }
  &__title {
    margin: 0;
    font-weight: 600;
    font-size: 12px;
    line-height: 1.25;
  }
  &__body {
    margin: 12px 0 0;
    > *:nth-child(n+2) {
      margin-top: 8px;
    }
  }
}
</style>
