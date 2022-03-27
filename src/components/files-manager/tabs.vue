<template>
<nav class="tabs">
  <div class="tabs__contents">
    <button
      v-if="props.show.post"
      type="button"
      :disabled="props.active === 'post'"
      @click="onClickTab('post')">
      <span>
        <Icon name="archive"/>
        <em>Post</em>
      </span>
    </button>
    <button
      v-if="props.show.global"
      type="button"
      :disabled="props.active === 'global'"
      @click="onClickTab('global')">
      <span>
        <Icon name="folder"/>
        <em>Global</em>
      </span>
    </button>
  </div>
  <div class="tabs__functions">
    <button
      v-if="props.show.guide"
      type="button"
      title="Guide"
      @click="emits('select-function', 'guide')">
      <Icon name="command"/>
    </button>
    <button
      v-if="!!localStore.state.fullSize"
      type="button"
      title="Close"
      class="close"
      @click="emits('select-function', 'close')">
      <Icon name="x"/>
    </button>
  </div>
</nav>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import localStore from './store';
import Icon from '../icons/index.vue';

const props = defineProps({
  active: String,
  show: {
    post: { type: Boolean, default: false },
    global: { type: Boolean, default: true },
    guide: { type: Boolean, default: true },
    close: { type: Boolean, default: false },
  },
});
const emits = defineEmits([ 'select-tab', 'select-function' ]);
let tabNames;

function onClickTab(tab)
{
  emits('select-tab', {
    key: tab,
    options: {},
  });
}

function changeTab()
{
  let idx = tabNames.indexOf(props.active);
  idx = idx + 1;
  if (idx >= tabNames.length) idx = 0;
  localStore.state.tab = tabNames[idx] || 'global';
}

onMounted(() => {
  tabNames = [
    props.show.post && 'post',
    props.show.global && 'global',
  ].filter(Boolean);
});

defineExpose({
  changeTab,
});
</script>

<style src="./tabs.scss" lang="scss" scoped></style>
