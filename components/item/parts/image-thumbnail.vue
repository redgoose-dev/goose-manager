<template>
<figure
  :class="[
    'image-thumbnail',
    type && `image-thumbnail--type-${type}`,
    mode && `image-thumbnail--mode-${mode}`,
  ]">
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
    mode: { type: String, default: null }, // limit,full
    type: { type: String, default: 'cover' }, // cover,contain
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/variables";
@import "../../../assets/scss/mixins";
.image-thumbnail {
  $self: '.image-thumbnail';
  user-select: none;
  background-color: #d5d5d5;
  a {
    display: block;
    width: 100%;
    text-decoration: none;
  }
  img {
    display: block;
    width: 100%;
  }
  &--mode {
    &-limit {
      img {
        max-height: 500px;
      }
      #{$self}__empty {
        min-height: 180px;
      }
    }
    &-full {
      a {
        height: 100%;
      }
      img {
        height: 100%;
      }
    }
  }
  &--type {
    &-cover {
      img {
        object-fit: cover;
      }
    }
    &-contain {
      img {
        object-fit: contain;
      }
    }
  }

  @include dark-mode() {
    background-color: #111;
  }
}
</style>
