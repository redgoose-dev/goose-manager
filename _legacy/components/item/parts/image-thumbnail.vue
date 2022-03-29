<template>
<figure
  :class="[
    'image-thumbnail',
    type && `image-thumbnail--type-${type}`,
    mode && `image-thumbnail--mode-${mode}`,
  ]">
  <a v-if="computedLinkType === 'a'" :href="href" :target="target" tabindex="-1">
    <img v-if="!!src" :src="src" :alt="alt" class="image-thumbnail__image"/>
    <image-empty v-else class="image-thumbnail__empty"/>
  </a>
  <nuxt-link v-else-if="computedLinkType === 'router'" :to="href" tabindex="-1">
    <img v-if="!!src" :src="src" :alt="alt" class="image-thumbnail__image"/>
    <image-empty v-else class="image-thumbnail__empty"/>
  </nuxt-link>
  <img v-else-if="!!src" :src="src" :alt="alt" class="image-thumbnail__image"/>
  <image-empty v-else class="image-thumbnail__empty"/>
</figure>
</template>

<script>
export default {
  name: 'image-thumbnail',
  components: {
    'image-empty': () => import('./image-empty'),
  },
  props: {
    src: { type: String, default: null },
    alt: { type: String, default: '' },
    href: { type: String, default: null },
    target: { type: String, default: null },
    mode: { type: String, default: null }, // limit,full
    type: { type: String, default: 'cover' }, // cover,contain
  },
  computed: {
    computedLinkType()
    {
      return (this.href && /^http/.test(this.href)) ? 'a' : (this.href ? 'router' : null);
    },
  },
}
</script>

<style src="./image-thumbnail.scss" lang="scss" scoped/>
