<template>
<article class="guide">
  <PageHeader
    module="guide"
    :prefix="prefix"
    :title="title"
    class="guide__header"/>
  <Tabs class="guide__tabs"/>
  <div class="guide__body">
    <Home v-if="isHome"/>
    <router-view v-else/>
  </div>
</article>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '../../components/page/header/index.vue'
import Tabs from '../../components/pages/guide/tabs.vue'
import Home from './home.vue'

const route = useRoute()
const prefix = computed(() => (route.name === 'Guide' ? null : '[Guide]'))
const title = computed(() => {
  switch (route.name)
  {
    case 'GuideButton': return 'Button'
    case 'GuideForm': return 'Form'
    case 'GuideFieldset': return 'Fieldset'
    case 'GuideIcon': return 'Icon'
    case 'GuideColor': return 'Color'
    case 'GuideFile': return 'File'
    case 'GuideModal': return 'Modal'
    case 'GuideEtc': return 'ETC'
    default: return 'Guide'
  }
})
const isHome = computed(() => (route.name === 'Guide'))
</script>

<style src="./index.scss" lang="scss" scoped></style>
