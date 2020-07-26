<template>
<div :class="['item-card', href && 'item-card--link']" :title="alt">
  <slot name="before"/>
  <image-thumbnail
    v-if="useImage"
    :src="image"
    :href="href"
    :target="target"
    :alt="alt"
    mode="full"
    type="cover"
    class="item-card__image"/>
	<div class="item-card__body">
    <text-title
      :label="title"
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
  name: 'item-card',
  components: {
    'text-title': () => import('./parts/text-title'),
    'nav-text': () => import('./parts/nav-text'),
    'metas': () => import('./parts/metas'),
    'image-thumbnail': () => import('./parts/image-thumbnail'),
  },
  props: {
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

<style src="./card.scss" lang="scss" scoped/>
