<template>
<div
  ref="$root"
  :class="[ 'wrap', dragOver && 'wrap--drag-over' ]"
  @click="onSelectAll(false)">
  <div
    v-if="props.index.length > 0"
    class="attachments">
    <ul class="attachments__index">
      <li v-for="(item, key) in props.index" @click.stop="">
        <FileProgress v-if="item.ready"/>
        <Item
          v-else
          :image="item.pathFull"
          :name="item.name"
          :type="item.type"
          :size="item.size"
          :badge="[
            (post.thumbnail?.srl && item.srl === post.thumbnail?.srl) && 'thumbnail',
          ].filter(Boolean)"
          :selected="selected[key]"
          @select-item="onSelectItem(key, $event)"
          @select-context-item="emits('select-context-item', key, $event)"/>
      </li>
    </ul>
  </div>
  <div v-else class="attachments-empty">
    <Icon name="paperclip"/>
    <p>There are no attachments.</p>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { fileManagerStore } from '../../../store/files-manager'
import { selectItem, selectAll } from '../selectItems'
import Icon from '../../icons/index.vue'
import Item from './item.vue'
import FileProgress from '../file-progress.vue'

const props = defineProps({
  index: { type: Array, required: true },
  processing: { type: Boolean, required: true },
})
const emits = defineEmits([ 'change-select', 'select-context-item', 'upload' ])
const localStore = fileManagerStore()
const $root = ref()
const selected = ref(new Array(props.index.length).fill(false))
const post = computed(() => (localStore.post))
let dragEvent = false
let dragOver = ref(false)

function onSelectItem(key, event)
{
  selected.value = selectItem(selected.value, key, event)
  exportSelected()
}

function onSelectAll(sw = undefined)
{
  selected.value = selectAll(selected.value, sw)
  exportSelected()
}

function exportSelected()
{
  let tree = selected.value.map((o, key) => (!!o ? key : undefined)).filter(o => (o !== undefined))
  emits('change-select', tree)
}

function onReset()
{
  selected.value = new Array(props.index.length).fill(false)
}

function onOverFiles(e)
{
  e.preventDefault()
  if (dragOver.value) return
  dragOver.value = true
}
function onLeaveFiles(e)
{
  e.preventDefault()
  if ($root.value === e.target) dragOver.value = false
}
function onDropFiles(e)
{
  e.preventDefault()
  dragOver.value = false
  const files = (e.dataTransfer) ? e.dataTransfer.files : undefined
  if (files?.length > 0) emits('upload', files)
}

onMounted(() => {
  if (window.File && window.FileList && window.FileReader && window.Blob && !dragEvent)
  {
    dragEvent = true
    if ($root.value)
    {
      $root.value.addEventListener('dragover', onOverFiles, false)
      $root.value.addEventListener('dragleave', onLeaveFiles, false)
      $root.value.addEventListener('drop', onDropFiles, false)
    }
  }
})
onUnmounted(() => {
  if (dragEvent)
  {
    dragEvent = false;
    if ($root.value)
    {
      $root.value.removeEventListener('dragover', onOverFiles, false)
      $root.value.removeEventListener('dragleave', onLeaveFiles, false)
      $root.value.removeEventListener('drop', onDropFiles, false)
    }
  }
})
defineExpose({
  selectAll: onSelectAll,
  reset: onReset,
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
