<template>
<div class="item-brick" :title="alt">
  <image-thumbnail
    :src="image"
    :link="link"
    :href="href"
    :target="target"
    :alt="alt"
    mode="limit"
    type="cover"
    class="item-brick__image"/>
  <div class="item-brick__body">
    <text-title :label="title" :link="link" :href="href" :target="target"/>
    <metas
      v-if="!!metas && metas.length"
      :items="metas"
      class="item-brick__metas"/>
    <nav-text
      v-if="navs && navs.length"
      :items="navs"
      class="item-brick__nav-text"/>
  </div>
</div>
</template>

<script>
export default {
  name: 'item-brick',
  components: {
    'image-thumbnail': () => import('./parts/image-thumbnail'),
    'text-title': () => import('./parts/text-title'),
    'metas': () => import('./parts/metas'),
    'nav-text': () => import('./parts/nav-text'),
  },
  props: {
    link: { type: String, default: null },
    href: { type: String, default: null },
    target: { type: String, default: null },
    image: { type: String, default: null },
    title: { type: String, default: 'item title' },
    alt: { type: String, default: 'item description' },
    metas: { type: Array, default: null },
    navs: { type: Array, default: null },
    useImage: { type: Boolean, default: true },
  },
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables";
@import "../../assets/scss/mixins";

.item-brick {
  $self: '.item-brick';
  position: relative;
  background-color: #fff;
  border-radius: $size-border-radius;
  overflow: hidden;
  min-width: 0;
  box-sizing: border-box;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    transition: box-shadow 100ms ease-out;
    border-radius: $size-border-radius;
  }
  &:hover:after {
    box-shadow: inset 0 0 0 1px var(--color-key);
  }

  &__image {
    margin: 0;
  }
  &__body {
    padding: 10px;
  }
  &__metas {
    margin: 2px 0 0;
  }
  &__nav-text {
    margin: 4px 0 0;
  }
  @include dark-mode() {
    background-color: $color-dark-content-bg;
  }
}
</style>
