<template>
<component
  :is="_tag"
  v-bind="_rootProps"
  @click="emits('click:body', $event)">
  <Image
    v-if="props.src"
    :src="props.src"
    :alt="props.alt"
    :width="props.width"
    :height="props.height"
    :use-fetch="_useFetch"
    class="image"/>
  <i v-else-if="props.icon" class="icon-wrap">
    <Icon :name="props.icon"/>
  </i>
  <Empty v-else title="no item"/>
</component>
</template>

<script setup>
import { computed } from 'vue'
import { Image } from '../../content/index.js'
import Empty from './thumbnail-empty.vue'
import Icon from '../../icon/index.vue'

const props = defineProps({
  src: String,
  href: [ String, Object ],
  target: String,
  alt: String,
  type: String, // cover,contain
  icon: String,
  width: Number,
  height: Number,
})
const emits = defineEmits([ 'click:body' ])

const _tag = computed(() => (props.href ? 'a' : 'strong'))
const _rootProps = computed(() => {
  let attr = {}
  switch (_tag.value)
  {
    case 'a':
      attr.href = props.href || '#'
      if (props.target) attr.target = props.target;
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
const _useFetch = computed(() => (!/^http/.test(props.src)))
</script>

<style lang="scss" scoped>
@use '../../../scss/mixins';
.thumbnail {
  position: relative;
  display: block;
  margin: 0;
  user-select: none;
  overflow: clip;
  aspect-ratio: var(--item-img-ratio, unset);
  &:has(.image) {
    > * {
      transform-origin: 50% 50%;
      transition: transform 240ms ease-out;
    }
    &:hover > * {
      transform: scale(1.05);
    }
  }
}
.image {
  display: block;
  box-sizing: border-box;
  background-color: var(--item-thumbnail-bg, var(--color-edge));
  --img-width: 100%;
  --img-height: 100%;
}
.type {
  &--cover {
    .image {
      --img-height: 100%;
      --img-fit: cover;
    }
  }
  &--contain {
    .image {
      --img-height: 100%;
      --img-fit: contain;
    }
  }
}
.icon-wrap {
  display: grid;
  place-content: center;
  width: 100%;
  height: 100%;
  background: mixins.mix-alpha(var(--color-weak), 100%);
  --icon-size: 52px;
  --icon-stroke: 1;
  --icon-color: var(--color-edge);
}
</style>
