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
    <Title
      v-if="props.title"
      :href="props.href"
      :target="props.target"
      class="item__title">
      {{props.title}}
    </Title>
    <Description
      v-if="props.description"
      class="item__description">
      {{props.description}}
    </Description>
    <Meta
      v-if="props.meta?.length > 0"
      :items="props.meta"
      class="item__meta"/>
    <Nav
      v-if="props.nav?.length > 0"
      :items="props.nav"
      class="item__nav"/>
  </div>
  <slot v-if="$slots.after" name="after"/>
</section>
</template>

<script setup>
import ThumbnailImage from './assets/thumbnail-image.vue';
import Title from './assets/title.vue';
import Description from './assets/description.vue';
import Meta from './assets/meta.vue';
import Nav from './assets/nav.vue';

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
