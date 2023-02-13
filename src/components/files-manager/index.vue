<template>
<article :class="[ 'files-manager', localStore.fullSize && 'files-manager--full' ]">
  <Tabs
    ref="$tabs"
    :active="localStore.tab"
    :show="showTabButtons"
    class="files-manager__tabs"
    @function="selectFunctionFromTabs"/>
  <div class="files-manager__body">
    <component
      ref="$module"
      v-if="!!contentBody"
      :is="contentBody"
      @custom-event="onCustomEvent"
      @close="emits('close')"/>
    <div v-else class="files-manager__no-tab">
      There is no tab selected.
    </div>
  </div>
  <teleport to="#modals">
    <Modal :show="guide" @close="guide = false">
      <ModalBody type="window">
        <Guide @close="guide = false"/>
      </ModalBody>
    </Modal>
  </teleport>
</article>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { fileManagerStore } from '../../store/tool-manager'
import { controlWindow } from './util'
import { Modal, ModalBody } from '../modal'
import Tabs from './tabs.vue'
import Guide from './guide.vue'

interface Props {
  tab: string
  post?: {
    module: 'articles' | 'comments'
    targetSrl: number
    cropper: {}
    thumbnail: {}
    limitCount: number
    limitSize: number
    thumbnailType: string
  }
  global?: {
    path: string
  },
  acceptFileType?: string
  fullSize?: boolean
  useThumbnail?: boolean
}

const $tabs = ref<any>()
const $module = ref<any>()
const props = defineProps<Props>()
const emits = defineEmits([ 'close', 'custom-event' ])
const localStore = fileManagerStore()
const guide = ref<boolean>(false)
const contentBody = computed<any>(() => {
  switch (localStore.tab)
  {
    case 'post':
      return defineAsyncComponent(() => import('./modules/post.vue'))
    case 'global':
      return defineAsyncComponent(() => import('./modules/global.vue'))
    default:
      return null
  }
})
const showTabButtons = computed<any>(() => {
  const { module } = localStore.post
  return {
    post: module === 'articles' || module === 'comments' || module === 'checklist',
    global: true,
    guide: true,
    close: localStore.fullSize,
  }
})

onMounted(() => {
  window.on('keyup.file-manager', (e: any) => shortcuts(e, 'keyup'))
  window.on('keydown.file-manager', (e: any) => shortcuts(e, 'keydown'))
})
onUnmounted(() => {
  window.off('keyup.file-manager')
  window.off('keydown.file-manager')
})

initialize()

function initialize(): void
{
  localStore.setup()
  localStore.tab = props.tab || 'global'
  localStore.acceptFileType = props.acceptFileType || 'image/*'
  localStore.fullSize = props.fullSize || false
  localStore.useThumbnail = props.useThumbnail || false
  if (props.post)
  {
    localStore.post.module = props.post.module
    localStore.post.targetSrl = props.post.targetSrl
    localStore.post.limitCount = props.post.limitCount
    localStore.post.limitSize = props.post.limitSize
    if (props.useThumbnail)
    {
      localStore.post.thumbnail = props.post.thumbnail || {}
      localStore.post.cropper = props.post.cropper
      localStore.post.thumbnailType = props.post.thumbnailType
    }
  }
  localStore.window = []
}

function selectFunctionFromTabs(key: string): void
{
  switch (key)
  {
    case 'guide':
      guide.value = true
      break
    case 'close':
      emits('close')
      break
  }
}

function onCustomEvent({ key, value }: { key: string, value: any }): void
{
  switch (key)
  {
    case 'insert-text':
    case 'update-thumbnail':
      emits('custom-event', { key, value })
      break
  }
}

function shortcuts(e: KeyboardEvent, type: string): void
{
  switch (type)
  {
    case 'keyup':
      e.preventDefault()
      if (e.key === 'Escape') pushEscKey()
      if (e.key === 'Tab') $tabs.value.changeTab()
      break
    case 'keydown':
      if (e.metaKey || e.ctrlKey)
      {
        switch (e.key)
        {
          case 'Enter':
            $module.value.func('insert-markdown')
            break
          case 'a':
            $module.value.selectAll()
            break
        }
      }
      break
  }
}

function pushEscKey(): void
{
  if (localStore.window.length > 0)
  {
    let key = localStore.window[localStore.window.length - 1]
    controlWindow(false)
    switch (key)
    {
      case 'guide':
        guide.value = false
        break
      case 'thumbnail-preview':
        $module.value.func('close-thumbnail-preview')
        break
      case 'thumbnail-editor':
        $module.value.func('close-thumbnail-editor')
        break
      case 'url-uploader':
        $module.value.func('close-url-uploader')
        break
    }
  }
  else
  {
    emits('close')
  }
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
