<template>
<component :is="tag" v-bind="rootProps">
  <img
    v-if="props.src"
    :src="props.src"
    :alt="props.alt"
    class="thumbnail__image">
  <Empty v-else class="thumbnail__empty"/>
</component>
</template>

<script setup>
import { computed } from 'vue';
import Empty from './thumbnail-empty.vue';

const props = defineProps({
  src: String,
  href: [ String, Object ],
  target: String,
  alt: String,
  type: { type: String, default: 'cover' }, // cover,contain
});
const tag = computed(() => {
  if (props.href) return /^http/.test(props.href) ? 'a' : 'router-link';
  else return 'figure';
});
const rootProps = computed(() => {
  let attr = {};
  switch (tag.value)
  {
    case 'a':
      attr.href = props.href || '#';
      if (props.target) attr.target = props.target;
      break;
    case 'router-link':
      attr.to = props.href || '#';
      break;
  }
  attr.class = [
    'thumbnail',
    `thumbnail--type-${props.type}`,
  ];
  return attr;
});
</script>

<style lang="scss" scoped>
.thumbnail {
  position: relative;
  display: block;
  margin: 0;
  user-select: none;
  overflow: hidden;
  > * {
    transform-origin: 50% 50%;
    transition: transform 240ms ease-out;
  }
  &__image {
    display: block;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: rgb(220 220 220);
  }
  &__empty {
    box-sizing: border-box;
    height: 100%;
  }
  &--type {
    &-cover {
      .thumbnail__image {
        object-fit: cover;
      }
    }
    &-contain {
      .thumbnail__image {
        object-fit: contain;
      }
    }
  }
  &:hover {
    > * {
      transform: scale(1.05);
    }
  }
}
</style>
