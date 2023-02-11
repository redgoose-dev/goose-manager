<template>
<header class="page-header">
  <div>
    <h1 class="page-header__title">
      {{props.prefix ? `${props.prefix} ` : ''}}
      {{messages.title}}
    </h1>
    <p v-if="messages.description" class="page-header__description">
      {{messages.description}}
    </p>
  </div>
  <nav v-if="$slots.default" class="page-header__nav">
    <slot/>
  </nav>
</header>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { message } from '../../../message'

const props = defineProps<{
  title?: string
  description?: string
  module?: string
  prefix?: string
}>()
const messages = computed<any>(() => {
  switch(props.module)
  {
    case 'dashboard':
      return {
        title: props.title || 'Dashboard',
        description: props.description || '',
      }
    case 'apps':
      return {
        title: props.title || 'Apps',
        description: props.description || message.header.description.app,
      }
    case 'articles':
      return {
        title: props.title || 'Articles',
        description: props.description || message.header.description.article,
      }
    case 'categories':
      return {
        title: props.title || 'Categories',
        description: props.description || message.header.description.categories,
      }
    case 'nests':
      return {
        title: props.title || 'Nests',
        description: props.description || message.header.description.nests,
      }
    case 'users':
      return {
        title: props.title || 'Users',
        description: props.description || message.header.description.users,
      }
    case 'json':
      return {
        title: props.title || 'JSON',
        description: props.description || message.header.description.json,
      }
    case 'files':
      return {
        title: props.title || 'Files',
        description: props.description || message.header.description.files,
      }
    case 'checklist':
      return {
        title: props.title || 'Checklist',
        description: props.description || message.header.description.checklist,
      }
    case 'preference':
      return {
        title: props.title || 'Preference',
        description: props.description || message.header.description.preference,
      }
    case 'guide':
      return {
        title: props.title || 'Guide',
        description: props.description || message.header.description.guide,
      }
    default:
      return {
        title: props.title,
        description: props.description,
      }
  }
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
