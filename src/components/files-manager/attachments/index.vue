<template>
<div
  ref="$root"
  :class="[ 'wrap', dragOver && 'drag' ]"
  @click="onSelectAll(false)">
  <div
    v-if="!props.grouping && props.index.length > 0"
    class="attachments">
    <ul :class="[
      'index',
      localStore.attachmentTheme === 'thumbnail' && 'thumbnail',
      localStore.attachmentTheme === 'list' && 'list',
    ]">
      <li v-for="item in props.index" @click.stop="">
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
          :selected="selected[item.key]"
          @select-item="onSelectItem(item.key, $event)"
          @select-context-item="emits('select-context-item', item.key, $event)"/>
      </li>
    </ul>
  </div>
  <div
    v-else-if="props.grouping && Object.keys(props.index)?.length > 0"
    class="attachment-groups">
    <details v-for="(o,k) in props.index" open>
      <summary>
        {{k}} <em>{{o.length}}</em>
      </summary>
      <div class="attachments">
        <ul :class="[
          'index',
          localStore.attachmentTheme === 'thumbnail' && 'thumbnail',
          localStore.attachmentTheme === 'list' && 'list',
        ]">
          <li v-for="item in o" @click.stop="">
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
              :selected="selected[item.key]"
              @select-item="onSelectItem(item.key, $event)"
              @select-context-item="emits('select-context-item', item.key, $event)"/>
          </li>
        </ul>
      </div>
    </details>
  </div>
  <div v-else class="empty">
    <Icon name="paperclip"/>
    <p>There are no attachments.</p>
  </div>
</div>
<teleport to="#modals">
  <div :class="[ 'drag-over', dragOver && 'active' ]">
    <span>Drop files here.</span>
  </div>
</teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { fileManagerStore } from '../store'
import { selectItem, selectAll } from '../selectItems'
import Icon from '../../icons/index.vue'
import Item from './item/index.vue'
import FileProgress from '../file-progress.vue'

const props = defineProps({
  count: { type: Number, required: true },
  index: { type: [Array,Object], required: true },
  grouping: Boolean,
  processing: { type: Boolean, required: true },
})
const emits = defineEmits([ 'change-select', 'select-context-item', 'upload', 'drag-over' ])
const localStore = fileManagerStore()
const $root = ref()
const selected = ref([])
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
  selected.value = new Array(props.count).fill(false)
}

function onOverFiles(e)
{
  e.preventDefault()
  if (dragOver.value) return
  dragOver.value = true
  emits('drag-over', dragOver.value)
}
function onLeaveFiles(e)
{
  e.preventDefault()
  if ($root.value === e.target)
  {
    dragOver.value = false
    emits('drag-over', dragOver.value)
  }
}
function onDropFiles(e)
{
  e.preventDefault()
  dragOver.value = false
  emits('drag-over', dragOver.value)
  const files = (e.dataTransfer) ? e.dataTransfer.files : undefined
  if (files?.length > 0) emits('upload', files)
}

onReset()

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
