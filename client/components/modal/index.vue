<template>
<transition name="modal">
  <div
    v-if="props.open"
    ref="$modal"
    tabindex="-1"
    aria-modal="true"
    role="dialog"
    :class="[
      'modal',
      props.mode && `mode--${props.mode}`,
    ]"
    @dblclick="onClickOverlay"
    @keydown="onKeydown">
    <div class="body">
      <slot/>
    </div>
  </div>
</transition>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { modalRootClassName } from '../../libs/assets.js'

const $modal = ref()
const props = defineProps({
  open: Boolean,
  mode: { type: String, default: 'window' }, // full,window
  scroll: { type: Boolean, default: true }, // 스크롤 복원기능
  shortcut: Boolean,
})
const emits = defineEmits([ 'close' ])
const confirmClose = ref(false)
const backupScrollY = ref(0)

onMounted(() => { if (props.open) controlRoot(true) })
onUnmounted(() => { if (props.open) controlRoot(false) })
watch(() => props.open, async (value, oldValue) => {
  if (value === oldValue) return
  controlRoot(value)
  await control(value)
})

function onClickOverlay(e)
{
  if (e.target !== $modal.value) return
  emits('close')
}

function onKeydown(e)
{
  if (e.key !== 'Escape') return
  if ($modal.value !== e.target) return e.preventDefault()
  if (!props.shortcut) return e.preventDefault()
  emits('close')
}

function controlRoot(sw)
{
  if (!props.scroll) return
  if (sw) backupScrollY.value = window.scrollY
  if (!sw && document.getElementById('modals').children.length > 1) return
  document.documentElement.classList[sw ? 'add' : 'remove'](modalRootClassName)
}

async function control(sw)
{
  if (sw)
  {
    await nextTick()
    if ($modal.value) $modal.value.focus()
  }
  else
  {
    if ($modal.value) $modal.value.blur()
    if (props.scroll)
    {
      await nextTick()
      await nextTick()
      window.scrollTo({ top: backupScrollY.value })
    }
  }
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
