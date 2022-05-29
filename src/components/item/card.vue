<template>
<section :class="['item', props.href && 'item--link']">
  <slot v-if="$slots.before" name="before"/>
  <ThumbnailImage
    v-if="props.alt"
    :src="props.image"
    :href="props.href"
    :target="props.target"
    :alt="props.alt"
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
import ThumbnailImage from './assets/thumbnail-image.vue';
import ItemTitle from './assets/item-title.vue';
import Description from './assets/description.vue';
import ItemMeta from './assets/item-meta.vue';
import ItemNav from './assets/item-nav.vue';

const props = defineProps({
  image: String,
  alt: String,
  title: String,
  description: String,
  meta: Array,
  nav: Array,
  href: [ String, Object ],
  target: String,
});
</script>

<style src="./card.scss" lang="scss" scoped></style>
