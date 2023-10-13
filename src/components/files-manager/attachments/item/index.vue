<template>
<div :class="[ 'attachment', props.selected && 'selected' ]">
  <component
    :is="themeComponent"
    :image="props.image"
    :name="props.name"
    :type="props.type"
    :file-type="fileType"
    :size="props.size"
    :badge="props.badge"
    :context="context"
    @select-item="emits('select-item', $event)"
    @select-context-item="onClickContextItem"/>
</div>
</template>

<script setup>
import { computed } from 'vue'
import { fileManagerStore } from '../../../../store/files-manager'
import ThemeThumbnail from './theme-thumbnail.vue'
import ThemeList from './theme-list.vue'

const props = defineProps({
  image: String,
  name: String,
  type: String,
  size: Number,
  badge: Array,
  selected: Boolean,
})
const emits = defineEmits([ 'select-item', 'select-context-item' ])
const localStore = fileManagerStore()
const type = computed(() => {
  if (!props.type) return ''
  const type = props.type.split('/')[0]
  switch (type)
  {
    case 'image':
      return 'image'
    default:
      return 'file'
  }
})
const fileType = computed(() => {
  if (/^image/.test(props.type || ''))
  {
    return 'image'
  }
  else if (/^audio/.test(props.type || ''))
  {
    return 'audio'
  }
  else if (/^video/.test(props.type || ''))
  {
    return 'video'
  }
  else if (/^text/.test(props.type || ''))
  {
    return 'text'
  }
  return 'file'
})
const context = computed(() => {
  return [
    'open-new-window',
    localStore.markdown && 'insert-markdown',
    !localStore.markdown && 'insert-raw',
    localStore.markdown && 'insert-html',
    localStore.markdown && 'insert-address',
    (localStore.tab === 'post' && localStore.useThumbnail) && 'set-thumbnail',
    'delete',
  ].filter(Boolean)
})
const themeComponent = computed(() => {
  switch (localStore.attachmentTheme)
  {
    case 'thumbnail':
      return ThemeThumbnail
    case 'list':
      return ThemeList
  }
})

function onClickContextItem(key)
{
  emits('select-context-item', key)
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
