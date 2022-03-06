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
      v-if="props.show.close"
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

function onClickTab(tab)
{
  emits('select-tab', {
    key: tab,
    options: {},
  });
}
</script>

<style src="./tabs.scss" lang="scss" scoped></style>
