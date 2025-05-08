<template>
<section class="item">
  <slot v-if="$slots.before" name="before"/>
  <ThumbnailImage
    v-if="props.alt"
    :src="image"
    :href="props.href"
    :target="props.target"
    :alt="props.alt"
    :width="props.json?.width"
    :height="props.json?.height"
    :type="props.thumbnailType"
    class="item__thumbnail"/>
  <div class="item__body">
    <ItemTitle
      v-if="props.title"
      :href="props.href"
      :target="props.target"
      class="item__title">
      {{props.title}}
    </ItemTitle>
    <Description
      v-if="props.description"
      class="item__description">
      {{props.description}}
    </Description>
    <ItemMeta
      v-if="props.meta?.length > 0"
      :items="props.meta"
      class="item__meta"/>
    <ItemNav
      v-if="props.nav?.length > 0"
      :items="props.nav"
      class="item__nav"/>
  </div>
  <slot v-if="$slots.after" name="after"/>
</section>
</template>

<script setup>
import { computed } from 'vue'
import { getResizePath } from '../../libs/strings.js'
import ThumbnailImage from './assets/thumbnail-image.vue'
import ItemTitle from './assets/item-title.vue'
import Description from './assets/description.vue'
import ItemMeta from './assets/item-meta.vue'
import ItemNav from './assets/item-nav/index.vue'

const props = defineProps({
  image: String,
  alt: String,
  title: String,
  description: String,
  meta: Array,
  nav: Array,
  href: String,
  target: String,
  json: { type: Object, default: {} },
  useThumbnail: Boolean,
  thumbnailType: String,
})
const image = computed(() => {
  return props.useThumbnail ? getResizePath(props.image, 'width=640&height=480&quality=80') : props.image
})
</script>

<style src="./thumbnail.scss" lang="scss" scoped></style>
