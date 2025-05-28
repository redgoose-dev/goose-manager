<template>
<dialog
  ref="$root"
  v-if="open"
  class="lightbox"
  @click="onClose"
  @cancel.prevent="onClose">
  <figure>
    <Image
      :src="props.src"
      draggable="false"
      :use-fetch="props.useFetch"
      :alt="props.title"/>
  </figure>
  <nav class="close">
    <button
      ref="_close"
      type="button"
      title="Close"
      @click.stop="onClose">
      <Icon name="x"/>
    </button>
  </nav>
</dialog>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'
import Icon from '../icon/index.vue'
import Image from '../content/image.vue'

const _close = ref()
const props = defineProps({
  src: String,
  title: String,
  useFetch: Boolean,
})
const emits = defineEmits([ 'close' ])
const $root = ref()
const open = ref(false)
const backupScrollY = ref(0)

watch(() => !!props.src, control)
onUnmounted(() => control(false))

async function control(sw)
{
  if (sw)
  {
    backupScrollY.value = window.scrollY
    open.value = true
    await nextTick()
    $root.value.showModal()
    controlRoot(true)
    await nextTick()
    _close.value.blur()
  }
  else
  {
    if ($root.value) $root.value.close()
    open.value = false
    controlRoot(false)
    await nextTick()
    window.scrollTo({ top: backupScrollY.value })
  }
}

function controlRoot(sw)
{
  if (!sw && document.getElementById('modal')?.children.length > 1) return
  document.documentElement.classList[sw ? 'add' : 'remove']('mode-not-scroll')
}

function onClose()
{
  emits('close')
}
</script>

<style src="./lightbox.scss" lang="scss" scoped></style>
