<template>
<div :class="['item-thumbnail', link && 'item-thumbnail--link']" :title="alt">
  <image-thumbnail
    :src="image"
    :link="link"
    :href="href"
    :target="target"
    :alt="alt"
    mode="full"
    type="cover"
    class="item-thumbnail__image"/>
  <div class="item-thumbnail__body">
    <text-title :label="title" :link="link" :href="href" :target="target"/>
    <metas
      v-if="!!metas && metas.length"
      :items="metas"
      class="item-thumbnail__metas"/>
    <nav-text
      v-if="navs && navs.length"
      :items="navs"
      class="item-thumbnail__nav-text"/>
  </div>
</div>
</template>

<script>
export default {
  name: 'item-thumbnail',
  components: {
    'text-title': () => import('./parts/text-title'),
    'nav-text': () => import('./parts/nav-text'),
    'text-description': () => import('./parts/text-description'),
    'metas': () => import('./parts/metas'),
    'image-thumbnail': () => import('./parts/image-thumbnail'),
  },
  props: {
    link: { type: String, default: null },
    href: { type: String, default: null },
    target: { type: String, default: null },
    image: { type: String, default: null },
    title: { type: String, default: 'item title' },
    description: { type: String, default: null },
    alt: { type: String, default: 'item description' },
    metas: { type: Array, default: null },
    navs: { type: Array, default: null },
  },
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables";
@import "../../assets/scss/mixins";
.item-thumbnail {
  $self: '.item-thumbnail';
  $size: 165px;
  position: relative;
  box-shadow: $shadow-box;
  background-color: #fff;
  border-radius: $size-border-radius;
  min-width: 0;
  &__image {
    position: relative;
    margin: 0;
    height: $size;
    border-top-left-radius: $size-border-radius;
    border-top-right-radius: $size-border-radius;
    overflow: hidden;
    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background: rgba(0,0,0,.1);
      transform: scaleY(.5) translateY(.5px);
      pointer-events: none;
    }
  }
  &__body {
    padding: 15px;
  }
  &__metas {
    margin: 2px 0 0;
  }
  &__nav-text {
    margin: 4px 0 0;
  }
  &--link {
    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      pointer-events: none;
      transition: box-shadow .15s ease-out;
      border-radius: $size-border-radius;
    }
    &:hover:after {
      box-shadow: inset 0 0 0 1px var(--color-key);
    }
  }
  @include dark-mode() {
    background-color: $color-dark-content-bg;
  }
}
</style>
