<template>
<nav class="tabs">
  <div class="tabs__contents">
    <button
      v-if="props.show.post"
      type="button"
      :disabled="props.active === 'post'"
      @click="localStore.tab = 'post'">
      <span>
        <Icon name="archive"/>
        <em>Post</em>
      </span>
    </button>
    <button
      v-if="props.show.global"
      type="button"
      :disabled="props.active === 'global'"
      @click="localStore.tab = 'global'">
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
      @click="emits('function', 'guide')">
      <Icon name="command"/>
    </button>
    <button
      v-if="!!localStore.fullSize"
      type="button"
      title="Close"
      class="close"
      @click="emits('function', 'close')">
      <Icon name="x"/>
    </button>
  </div>
</nav>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { fileManagerStore } from '../../store/tool-manager'
import Icon from '../icons/index.vue'

interface Props {
  active: string
  show: {
    post: boolean
    global: boolean
    guide: boolean
    close: boolean
  }
}

const props = defineProps<Props>();
const emits = defineEmits([ 'function' ]);
const localStore = fileManagerStore()
let tabNames: (false | string)[]

function changeTab()
{
  let idx = tabNames.indexOf(props.active)
  idx = idx + 1
  if (idx >= tabNames.length) idx = 0
  localStore.tab = tabNames[idx] || 'global'
}

onMounted(() => {
  tabNames = [
    props.show.post && 'post',
    props.show.global && 'global',
  ].filter(Boolean);
})

defineExpose({
  changeTab,
})
</script>

<style src="./tabs.scss" lang="scss" scoped></style>
