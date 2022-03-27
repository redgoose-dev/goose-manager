<template>
<div
  :title="alt"
  :class="[
    'item-list',
    href && 'item-list--link',
    type && `item-list--type-${type}`,
  ]">
  <div class="item-list__wrap">
    <image-thumbnail
      v-if="useImage"
      :src="image"
      :href="href"
      :target="target"
      :alt="alt"
      mode="full"
      type="cover"
      class="item-list__image"/>
    <div class="item-list__body">
      <text-title :label="title" :href="href" class="item-list__title"/>
      <text-description v-if="!!description" :label="description" class="item-list__description"/>
      <metas v-if="!!metas && metas.length" :items="metas" class="item-list__metas"/>
      <nav-text v-if="navs && navs.length && navType==='text'" :items="navs" class="item-list__nav-text"/>
    </div>
    <nav-button v-if="navs && navs.length && navType==='button'" :items="navs"/>
  </div>
</div>
</template>

<script>
export default {
  name: 'item-list',
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
    type: { type: String, default: 'public' }, // public,private
    title: { type: String, default: '' },
    description: { type: String, default: '' },
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

<style src="./list.scss" lang="scss" scoped/>
