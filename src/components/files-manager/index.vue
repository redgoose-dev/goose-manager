<template>
<article :class="[ 'files-manager', localStore.state.fullSize && 'files-manager--full' ]">
  <Tabs
    ref="$tabs"
    :active="localStore.state.tab"
    :show="showTabButtons"
    class="files-manager__tabs"
    @select-tab="selectTab"
    @select-function="selectFunction"/>
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
      <Body type="window">
        <Guide @close="guide = false"/>
      </Body>
    </Modal>
  </teleport>
</article>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import localStore from './store';
import { controlWindow } from './util';
import { Modal, Body } from '../modal';
import Tabs from './tabs.vue';
import ModulePost from './modules/post.vue';
import ModuleGlobal from './modules/global.vue';
import Guide from './guide.vue';

const $tabs = ref();
const $module = ref();
const props = defineProps({
  tab: { type: String, default: 'global' }, // post,global
  post: {
    module: String, // articles,comments
    targetSrl: Number,
    cropper: Object,
    thumbnail: Object,
    selectedThumbnail: undefined,
  },
  global: {
    path: { type: String, default: 'assets' },
  },
  acceptFileType: { type: String, default: 'image/*' },
  fullSize: Boolean,
  useThumbnail: Boolean,
});
const emits = defineEmits([ 'close', 'custom-event' ]);
const guide = ref(false);
const contentBody = computed(() => {
  switch (localStore.state.tab)
  {
    case 'post':
      return ModulePost;
    case 'global':
      return ModuleGlobal;
    default:
      return null;
  }
});
const showTabButtons = computed(() => {
  const { module } = localStore.state.post;
  return {
    post: module === 'articles' || module === 'comments' || module === 'checklist',
    global: true,
    guide: true,
    close: localStore.state.fullSize,
  };
});

initialize();

/**
 * initialize
 */
function initialize()
{
  localStore.commit('initialize');
  if (props.tab) localStore.state.tab = props.tab;
  localStore.state.acceptFileType = props.acceptFileType || 'image/*';
  localStore.state.fullSize = props.fullSize;
  localStore.state.useThumbnail = props.useThumbnail;
  if (props.global)
  {
    localStore.state.global.path = props.global.path || 'assets';
  }
  if (props.post)
  {
    localStore.state.post = {
      module: props.post.module,
      targetSrl: props.post.targetSrl,
      index: [],
      idx: 0,
      selected: [],
      limitCount: props.post.limitCount,
      limitSize: props.post.limitSize,
    };
    if (props.useThumbnail)
    {
      localStore.state.post.thumbnail = props.post.thumbnail || {};
      localStore.state.post.cropper = props.post.cropper;
      localStore.state.post.thumbnailType = props.post.thumbnailType;
    }
  }
  localStore.state.window = [];
}

function selectTab({ key })
{
  localStore.state.tab = key;
}
function selectFunction(key)
{
  switch (key)
  {
    case 'guide':
      guide.value = true;
      break;
    case 'close':
      emits('close');
      break;
  }
}

function onCustomEvent({ key, value })
{
  switch (key)
  {
    case 'insert-text':
    case 'update-thumbnail':
      emits('custom-event', { key, value });
      break;
  }
}

function shortcuts(e, type)
{
  switch (type)
  {
    case 'keyup':
      e.preventDefault();
      if (e.key === 'Escape') pushEscKey();
      if (e.key === 'Tab') $tabs.value.changeTab();
      break;
    case 'keydown':
      if (e.metaKey || e.ctrlKey)
      {
        switch (e.key)
        {
          case 'Enter':
            $module.value.func('insert-markdown');
            break;
          case 'a':
            $module.value.selectAll();
            break;
        }
      }
      break;
  }
}
function pushEscKey()
{
  if (localStore.state.window.length > 0)
  {
    let key = localStore.state.window[localStore.state.window.length - 1];
    controlWindow(false);
    switch (key)
    {
      case 'guide':
        guide.value = false;
        break;
      case 'thumbnail-preview':
        $module.value.func('close-thumbnail-preview');
        break;
      case 'thumbnail-editor':
        $module.value.func('close-thumbnail-editor');
        break;
    }
  }
  else
  {
    emits('close');
  }
}

onMounted(() => {
  window.on('keyup.file-manager', (e) => shortcuts(e, 'keyup'));
  window.on('keydown.file-manager', (e) => shortcuts(e, 'keydown'));
});
onUnmounted(() => {
  window.off('keyup.file-manager');
  window.off('keydown.file-manager');
});
</script>

<style src="./index.scss" lang="scss" scoped></style>
