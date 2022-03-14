<template>
<article :class="[ 'files-manager', localStore.state.fullSize && 'files-manager--full' ]">
  <Tabs
    :active="localStore.state.tab"
    :show="showTabButtons"
    class="files-manager__tabs"
    @select-tab="selectTab"
    @select-function="selectFunction"/>
  <div class="files-manager__body">
    <component
      v-if="!!contentBody"
      :is="contentBody"
      @custom-event="onCustomEvent"
      @open-window="controlWindow(true, $event)"
      @close-window="controlWindow(false, $event)"
      @close="emits('close')"/>
    <div v-else class="files-manager__no-tab">
      There is no tab selected.
    </div>
  </div>
  <teleport to="#modals">
    <Modal
      :show="guide"
      @close="controlGuide(false)">
      <Body type="window">
        <Guide @close="controlGuide(false)"/>
      </Body>
    </Modal>
  </teleport>
</article>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import localStore from './store';
import { Modal, Body } from '../modal';
import Tabs from './tabs.vue';
import ModulePost from './modules/post.vue';
import ModuleGlobal from './modules/global.vue';
import Guide from './guide.vue';

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
    post: module === 'articles' || module === 'comments',
    global: true,
    guide: true,
    close: localStore.state.fullSize,
  };
});

initialize();

function initialize()
{
  // initialize store
  localStore.commit('initialize');
  if (props.tab) localStore.state.tab = props.tab;
  localStore.state.fullSize = props.fullSize;
  if (props.global)
  {
    localStore.state.global.path = props.global.path || 'assets';
  }
  if (props.post)
  {
    localStore.state.post = {
      module: props.post.module,
      targetSrl: props.post.targetSrl,
      cropper: {},
      thumbnail: props.post.thumbnail || {},
      index: [],
      idx: 0,
      selected: [],
    };
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
      controlGuide(true);
      break;
    case 'close':
      emits('close');
      break;
  }
}

function controlWindow(sw, key)
{
  if (!key) return;
  if(sw)
  {
    if (!(localStore.state.window.indexOf(key) > -1)) localStore.state.window.push(key);
  }
  else
  {
    let idx = localStore.state.window.indexOf(key);
    if (idx > -1) localStore.state.window.splice(idx, 1);
  }
}

function controlGuide(sw)
{
  guide.value = sw;
  controlWindow(sw, 'guide');
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

onMounted(() => {
  // TODO: 단축키 설정하기
});
onUnmounted(() => {
  // TODO: 단축키 이벤트 해지하기
});
</script>

<style src="./index.scss" lang="scss" scoped></style>
