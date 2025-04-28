<template>
<component :is="tag" v-bind="rootProps">
  <img
    v-if="props.src"
    :src="props.src"
    :alt="props.alt"
    :width="props.width"
    :height="props.height"
    loading="lazy"
    class="thumbnail__image">
  <Empty v-else title="no item" class="thumbnail__empty"/>
</component>
</template>

<script setup>
import { computed } from 'vue'
import Empty from './thumbnail-empty.vue'

const props = defineProps({
  src: String,
  href: [ String, Object ],
  target: String,
  alt: String,
  type: String, // cover,contain
  width: Number,
  height: Number,
})
const tag = computed(() => {
  if (props.href) return /^http/.test(props.href) ? 'a' : 'router-link'
  else return 'figure'
})
const rootProps = computed(() => {
  let attr = {}
  switch (tag.value)
  {
    case 'a':
      attr.href = props.href || '#'
      if (props.target) attr.target = props.target;
      break
    case 'router-link':
      attr.to = props.href || '#'
      break
  }
  attr.class = [
    'thumbnail',
    props.type && `thumbnail--type-${props.type}`,
  ]
  if (Boolean(props.width && props.height))
  {
    attr.style = { '--img-ratio': `${props.width}/${props.height}` }
  }
  return attr
})
</script>

<style lang="scss" scoped>
@use '../../../assets/scss/mixins';
.thumbnail {
  position: relative;
  display: block;
  margin: 0;
  user-select: none;
  overflow: hidden;
  aspect-ratio: var(--item-img-ratio, unset);
  > * {
    transform-origin: 50% 50%;
    transition: transform 240ms ease-out;
  }
  &__image {
    display: block;
    box-sizing: border-box;
    background-color: var(--item-thumbnail-bg, rgb(220 220 220));
    width: 100%;
    height: auto;
  }
  &__empty {
    box-sizing: border-box;
  }
  &--type {
    &-cover {
      .thumbnail__image {
        height: 100%;
        object-fit: cover;
      }
    }
    &-contain {
      .thumbnail__image {
        height: 100%;
        object-fit: contain;
      }
    }
  }
  &:hover {
    > * {
      transform: scale(1.05);
    }
  }
  @include mixins.dark-mode() {
    --item-thumbnail-bg: rgb(85 85 85);
  }
}
</style>
