<template>
<figure :class="['image-thumbnail', type && `image-thumbnail--${type}`]">
  <nuxt-link v-if="!!link" :to="link">
    <img v-if="!!src" :src="src" :alt="alt" class="image-thumbnail__image"/>
    <image-empty v-else class="image-thumbnail__empty"/>
  </nuxt-link>
  <a v-else-if="href" :href="href" :target="target">
    <img v-if="!!src" :src="src" :alt="alt" class="image-thumbnail__image"/>
    <image-empty v-else class="image-thumbnail__empty"/>
  </a>
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
    src: { type: String, default: '' },
    alt: { type: String, default: '' },
    link: { type: String, default: null },
    href: { type: String, default: null },
    target: { type: String, default: null },
    type: { type: String, default: '' }, // contain
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/variables";
.image-thumbnail {
  user-select: none;
  a {
    display: block;
    width: 100%;
    height: 100%;
    text-decoration: none;
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &--contain {
    img {
      object-fit: contain;
    }
  }
}
</style>
