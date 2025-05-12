<template>
<article class="file-manager">
  <Header/>
  <Content/>
  <Footer/>
</article>
</template>

<script setup>
import { reactive, computed, provide, onMounted, onBeforeUnmount } from 'vue'
import fileManagerStore from './store.js'
import Header from './header.vue'
import Content from './content.vue'
import Footer from './footer.vue'

/**
 * props guide
 *
 * isWindow?: boolean
 * shortcut?: boolean
 * module?: 'article' | 'comment' | 'checklist' | 'json'
 * moduleSrl?: number
 */
const props = defineProps({
  isWindow: Boolean,
  shortcut: Boolean,
  module: String,
  moduleSrl: Number,
  useThumbnail: Boolean,
})
const emits = defineEmits([ 'close' ])

// setup file manager store
const fileManager = fileManagerStore()
provide('file-manager', fileManager)
provide('file-manager-event', {
  close: onClose,
  // TODO: 로컬 이벤트 필요하면 하나씩 추가하기
})

// lifecycles
onMounted(() => {
  fileManager.setup({
    isWindow: props.isWindow,
    module: props.module,
    moduleSrl: props.moduleSrl,
    shortcut: Boolean(props.shortcut),
    useThumbnail: props.useThumbnail,
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
