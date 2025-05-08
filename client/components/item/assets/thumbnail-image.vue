<template>
<component :is="_tag" v-bind="_rootProps">
  <img
    v-if="props.src"
    :src="props.src"
    :alt="props.alt"
    :width="props.width"
    :height="props.height"
    loading="lazy"
    class="image">
  <Empty v-else title="no item"/>
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

const _tag = computed(() => {
  if (props.href)
  {
    if (typeof props.href === 'string')
    {
      return /^http/.test(props.href) ? 'a' : 'router-link'
    }
    else
    {
      return 'router-link'
    }
  }
  else
  {
    return 'figure'
  }
})
const _rootProps = computed(() => {
  let attr = {}
  switch (_tag.value)
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
    props.type && `type--${props.type}`,
  ]
  if (Boolean(props.width && props.height))
  {
    attr.style = { '--img-ratio': `${props.width}/${props.height}` }
  }
  return attr
})
</script>

<style lang="scss" scoped>
@use '../../../scss/mixins';
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
  &:hover > * {
    transform: scale(1.05);
  }
}
.image {
  display: block;
  box-sizing: border-box;
  background-color: var(--item-thumbnail-bg, var(--color-weak));
  width: 100%;
  height: auto;
}
.type {
  &--cover {
    .image {
      height: 100%;
      object-fit: cover;
    }
  }
  &--contain {
    .image {
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
