<template>
<div class="item-list" :title="alt">
  <div class="item-list__wrap">
    <image-thumbnail
      v-if="useImage"
      :src="image"
      :link="link"
      :href="href"
      :target="target"
      :alt="alt"
      class="item-list__image"/>
    <div class="item-list__body">
      <text-title
        :label="title"
        :link="link"
        :href="href"
        class="item-list__title"/>
      <text-description v-if="!!description" :label="description"/>
      <metas
        v-if="!!metas && metas.length"
        :items="metas"
        class="item-list__metas"/>
      <nav-text
        v-if="navs && navs.length && navType==='text'"
        :items="navs"
        class="item-list__nav-text"/>
    </div>
    <nav-button v-if="navs && navs.length && navType==='button'" :items="navs"/>
  </div>
</div>
</template>

<script>
export default {
  components: {
    'button-basic': () => import('~/components/button/basic'),
    'nav-text': () => import('./parts/nav-text'),
    'nav-button': () => import('./parts/nav-button'),
    'metas': () => import('./parts/metas'),
    'text-title': () => import('./parts/text-title'),
    'text-description': () => import('./parts/text-description'),
    'image-thumbnail': () => import('./parts/image-thumbnail'),
  },
  props: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    link: { type: String, default: null },
    href: { type: String, default: null },
    target: { type: String, default: '' },
    image: { type: String, default: null },
    alt: { type: String, default: '' },
    metas: { type: Array, default: null },
    navs: { type: Array, default: null },
    navType: { type: String, default: 'text' },
    useImage: { type: Boolean, default: true },
  },
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables";
@import "../../assets/scss/mixins";

.item-list {
  $self: '.item-list';
  $size: 100px;

  position: relative;
  padding: 20px;
  background: #fff;
  box-shadow: $shadow-box;
  border-radius: $size-border-radius;

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
    box-shadow: 0 0 0 1px $color-key;
  }

  &__wrap {
    display: flex;
    align-items: center;
  }
  &__image {
    margin: -10px 15px -10px -10px;
    width: $size;
    height: $size;
  }
  &__body {
    flex: 1;
    margin-top: -3px;
  }
  &__metas {
    margin: 5px 0 0;
  }
  &__nav-text {
    margin: 5px 0 0;
  }
}
</style>