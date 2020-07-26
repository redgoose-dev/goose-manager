<template>
<div
  :title="alt"
  :class="[
    'item-thumbnail',
    href && 'item-thumbnail--link',
    type && `item-thumbnail--type-${type}`,
  ]">
  <image-thumbnail
    :src="image"
    :href="href"
    :target="target"
    :alt="alt"
    mode="full"
    type="cover"
    class="item-thumbnail__image"/>
  <div class="item-thumbnail__body">
    <text-title :label="title" :href="href" :target="target"/>
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
    type: { type: String, default: 'public' }, // public,private
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

<style src="./thumbnail.scss" lang="scss" scoped/>
