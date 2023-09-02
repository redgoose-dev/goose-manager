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
        <em>모듈 포스트</em>
      </span>
    </button>
    <button
      v-if="props.show.global"
      type="button"
      :disabled="props.active === 'global'"
      @click="localStore.tab = 'global'">
      <span>
        <Icon name="folder"/>
        <em>글로벌</em>
      </span>
    </button>
  </div>
  <div class="tabs__functions">
    <button
      v-if="props.show.guide"
      type="button"
      title="가이드"
      @click="emits('function', 'guide')">
      <Icon name="command"/>
    </button>
    <button
      v-if="!!localStore.fullSize"
      type="button"
      title="닫기"
      class="close"
      @click="emits('function', 'close')">
      <Icon name="x"/>
    </button>
  </div>
</nav>
</template>

<script setup>
import { onMounted } from 'vue'
import { fileManagerStore } from '../../store/files-manager'
import Icon from '../icons/index.vue'

const props = defineProps({
  active: { type: String, required: true },
  show: {
    type: Object,
    required: true,
    default: {
      post: false,
      global: false,
      guide: false,
      close: false,
    },
  },
})
const emits = defineEmits([ 'function' ])
const localStore = fileManagerStore()
let tabNames

function changeTab()
{
  if (localStore.window.length > 0) return
  let idx = tabNames.indexOf(props.active)
  idx = idx + 1
  if (idx >= tabNames.length) idx = 0
  localStore.tab = tabNames[idx] || 'global'
}

onMounted(() => {
  tabNames = [
    props.show.post && 'post',
    props.show.global && 'global',
  ].filter(Boolean)
})

defineExpose({
  changeTab,
})
</script>

<style src="./tabs.scss" lang="scss" scoped></style>
