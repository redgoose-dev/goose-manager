<template>
<div
  :title="alt"
  :class="[
    'item-brick',
    href && 'item-brick--link',
    type && `item-brick--type-${type}`,
  ]">
  <image-thumbnail
    :src="image"
    :href="href"
    :target="target"
    :alt="alt"
    mode="limit"
    type="cover"
    class="item-brick__image"/>
  <div class="item-brick__body">
    <text-title :label="title" :href="href" :target="target"/>
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
    type: { type: String, default: 'public' }, // public,private
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

<style src="./brick.scss" lang="scss" scoped/>
