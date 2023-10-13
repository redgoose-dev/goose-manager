<template>
<figure :class="[
  'image',
  localStore.attachmentDisplayImage && 'use-image',
  `type-${props.type}`,
]">
  <img
    v-if="props.type === 'image'"
    :src="props.src"
    :alt="props.name"
    loading="lazy"
    draggable="false"/>
  <Icon :name="typeIcon"/>
  <figcaption v-if="useInfo">
    <strong>{{props.name}}</strong>
    <em>{{props.size}}</em>
  </figcaption>
</figure>
</template>

<script setup>
import { computed } from 'vue'
import { fileManagerStore } from '../../../../store/files-manager'
import Icon from '../../../icons/index.vue'

const props = defineProps({
  src: String,
  name: String,
  type: String,
  size: String,
  useInfo: { type: Boolean, default: false },
})
const localStore = fileManagerStore()
const typeIcon = computed(() => {
  switch (props.type)
  {
    case 'image':
      return props.type
    default:
      return 'file'
  }
})
</script>

<style lang="scss" scoped>
@use '../../../../assets/scss/mixins';
.image {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0;
  background: var(--color-image-bg, hsl(0 0% 90%));
  min-width: 0;
  > svg {
    display: block;
    margin: 0 auto;
    --icon-color: var(--color-base);
    --icon-size: 28px;
    --icon-stroke: 1;
  }
  > figcaption {
    display: grid;
    text-align: center;
    padding: 0 20px;
    strong {
      display: block;
      margin: 10px 0 0;
      font-size: 10px;
      line-height: 1.15;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--color-edge);
    }
    em {
      display: block;
      margin: 4px 0 0;
      font-style: normal;
      font-size: 10px;
      font-weight: 400;
      color: var(--color-weak);
      line-height: 1.15;
    }
  }
  &.type-image {
    > img {
      display: none;
      width: 100%;
      height: 100%;
      object-fit: var(--image-fit, cover);
    }
    > svg {
      display: block;
    }
    > figcaption {
      display: grid;
    }
    &.use-image {
      > img {
        display: block;
      }
      > svg {
        display: none;
      }
      > figcaption {
        display: none;
      }
    }
  }
  @include mixins.dark-mode() {
    --color-image-bg: hsl(0 0% 14%);
  }
}
</style>
