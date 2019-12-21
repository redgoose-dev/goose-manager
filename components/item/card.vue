<template>
<div class="item-card" :title="alt">
  <slot name="before"/>
  <image-thumbnail
    v-if="useImage"
    :src="image"
    :link="link"
    :href="href"
    :target="target"
    :alt="alt"
    :type="imageType"
    class="item-card__image"/>
	<div class="item-card__body">
    <text-title
      :label="title"
      :link="link"
      :href="href"
      :target="target"
      class="item-card__title"/>
    <metas
      v-if="!!metas && metas.length"
      :items="metas"
      class="item-card__metas"/>
    <nav-text
      v-if="navs && navs.length"
      :items="navs"
      class="item-card__nav-text"/>
	</div>
  <slot name="after"/>
</div>
</template>

<script>
export default {
  components: {
    'text-title': () => import('./parts/text-title'),
    'nav-text': () => import('./parts/nav-text'),
    'metas': () => import('./parts/metas'),
    'image-thumbnail': () => import('./parts/image-thumbnail'),
  },
  props: {
    link: { type: String, default: null },
    href: { type: String, default: null },
    target: { type: String, default: null },
    image: { type: String, default: null },
    imageType: { type: String, default: null }, // contain
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

.item-card {
  $size: 100px;
  position: relative;
  display: flex;
  align-items: center;
  box-shadow: $shadow-box;
  height: $size;
  background: #fff;
  border-radius: $size-border-radius;
  min-width: 0;

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

	&__image {
    margin: 0;
    width: $size;
    height: 100px;
    border-top-left-radius: $size-border-radius;
    border-bottom-left-radius: $size-border-radius;
    overflow: hidden;
  }
	&__body {
		flex: 1;
		padding: 10px 20px;
		min-width: 0;
	}
  &__metas {
    margin: 2px 0 0;
  }
  &__nav-text {
    margin: 5px 0 0;
  }
}
</style>
