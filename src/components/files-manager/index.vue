<template>
<article :class="[ 'files-manager', props.full && 'files-manager--full' ]">
  <Tabs
    :active="tab"
    :show="showTabButtons"
    class="files-manager__tabs"
    @select-tab="selectTab"
    @select-function="selectFunction"/>
  <div class="file-manager__body">
    <component
      v-if="!!contentBody"
      :is="contentBody"
      @open-window="controlWindow(true, $event)"
      @close-window="controlWindow(false, $event)"/>
    <div v-else class="files-manager__no-tab">
      선택된 탭이 없습니다.
    </div>
  </div>
  <teleport to="#modals">
    <Modal :show="guide" @close="controlGuide(false)">
      <Body type="window">
        <Guide @close="controlGuide(false)"/>
      </Body>
    </Modal>
  </teleport>
</article>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Modal, Body } from '../modal';
import Tabs from './tabs.vue';
import ModulePost from './modules/post.vue';
import ModuleGlobal from './modules/global.vue';
import Guide from './guide.vue';

const props = defineProps({
  tab: String, // post,global
  post: {
    module: String, // articles,comments
    targetSrl: Number,
    croppie: {},
    thumbnail: {},
  },
  global: {
    path: { type: String, default: 'assets' },
  },
  acceptFileType: { type: String, default: 'image/*' },
  full: Boolean,
});
const emits = defineEmits([ 'close' ]);
const tab = ref(props.tab);
const guide = ref(false);
const contentBody = computed(() => {
  switch (tab.value)
  {
    case 'post':
      return ModulePost;
    case 'global':
      return ModuleGlobal;
    default:
      return null;
  }
});
const localWindow = ref([]);
const showTabButtons = computed(() => {
  const { module } = props.post;
  return {
    post: module === 'articles' || module === 'comments',
    global: true,
    guide: true,
    close: props.full,
  };
});

function selectTab({ key })
{
  tab.value = key;
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
    if (!(localWindow.value.indexOf(key) > -1)) localWindow.value.push(key);
  }
  else
  {
    let idx = localWindow.value.indexOf(key);
    if (idx > -1) localWindow.value.splice(idx, 1);
  }
}

function controlGuide(sw)
{
  guide.value = sw;
  controlWindow(sw, 'guide');
}

onMounted(() => {
  // TODO: 단축키 설정하기
});
onUnmounted(() => {
  // TODO: 단축키 이벤트 해지하기
});
</script>

<style src="./index.scss" lang="scss" scoped></style>
