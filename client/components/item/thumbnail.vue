<template>
<section class="item">
  <slot v-if="$slots.before" name="before"/>
  <ThumbnailImage
    :src="props.image"
    :icon="props.icon"
    :href="props.href"
    :target="props.target"
    :alt="props.alt"
    :width="props.json?.width"
    :height="props.json?.height"
    :type="props.thumbnailType"
    class="item__thumbnail"
    @click:body="onClickLink"/>
  <div class="item__body">
    <ItemTitle
      v-if="props.title"
      :href="props.href"
      :target="props.target"
      class="item__title"
      @click:body="onClickLink">
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
    <Status
      v-if="props.status?.length > 0"
      :items="props.status"
      class="item__status"/>
  </div>
  <slot v-if="$slots.after" name="after"/>
</section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import ThumbnailImage from './assets/thumbnail-image.vue'
import ItemTitle from './assets/item-title.vue'
import Description from './assets/description.vue'
import ItemMeta from './assets/item-meta.vue'
import ItemNav from './assets/item-nav/index.vue'
import Status from './assets/status.vue'

const router = useRouter()
const props = defineProps({
  image: String,
  icon: String,
  alt: String,
  title: String,
  description: String,
  meta: Array,
  nav: Array,
  status: Array,
  href: String,
  target: String,
  useButton: Boolean,
  json: { type: Object, default: {} },
  thumbnailType: String,
})
const emits = defineEmits([ 'click:body' ])

function onClickLink(e)
{
  if (!props.href)
  {
    e.preventDefault()
  }
  else if (props.useButton)
  {
    e.preventDefault()
    emits('click:body', props.href, e)
  }
  else if (/^http/.test(props.href))
  {
    if (props.target)
    {
      window.open(props.href, props.target || '_blank')
    }
    else
    {
      window.location = props.href
    }
  }
  else
  {
    e.preventDefault()
    router.push(props.href || '#')
  }
}
</script>

<style src="./thumbnail.scss" lang="scss" scoped></style>
