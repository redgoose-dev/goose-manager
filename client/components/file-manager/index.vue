<template>
<article class="file-manager">
  <Tab ref="$tab"/>
  <div class="body">
    <component :is="_contentBody"/>
  </div>
</article>
</template>

<script setup>
import { reactive, computed, provide, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import fileManagerStore from './store.js'
import { TAB } from './assets.js'
import Tab from './tab.vue'

/**
 * props guide
 *
 * tab: 'global' | 'post'
 * isWindow?: boolean
 * shortcut?: boolean
 * module?: 'article' | 'comment' | 'checklist' | 'json'
 * moduleSrl?: number
 */
const props = defineProps({
  tab: String,
  isWindow: Boolean,
  shortcut: Boolean,
  module: String,
  moduleSrl: Number,
})
const emits = defineEmits([ 'close' ])
const state = reactive({})

// setup file manager store
const fileManager = fileManagerStore()
provide('file-manager', fileManager)
provide('file-manager-event', {
  close: onClose,
  // TODO: 로컬 이벤트 필요하면 하나씩 추가하기
})

// set content body
const _contentBody = computed(() => {
  switch (fileManager.preference.tab)
  {
    case TAB.GLOBAL:
      return defineAsyncComponent(() => import('./content/global.vue'))
    case TAB.POST:
      return defineAsyncComponent(() => import('./content/post.vue'))
    default:
      return defineAsyncComponent(() => import('./content/none.vue'))
  }
})

// lifecycles
onMounted(() => {
  fileManager.setup({
    tab: props.tab,
    isWindow: props.isWindow,
    module: props.module,
    moduleSrl: props.moduleSrl,
    shortcut: Boolean(props.shortcut),
  })
  if (fileManager.preference.shortcut)
  {
    window.addEventListener('keyup', onPressKey)
  }
})
onBeforeUnmount(() => {
  if (fileManager.preference.shortcut)
  {
    window.removeEventListener('keyup', onPressKey)
  }
  fileManager.destroy()
})

function onPressKey(e)
{
  console.log('onPressKey', e)
}

function onClose()
{
  emits('close')
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
