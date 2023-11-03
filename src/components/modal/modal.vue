<template>
<transition name="modal">
  <div
    v-if="props.show"
    class="modal"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp">
    <slot/>
  </div>
</transition>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show: Boolean,
  scroll: Boolean, // 내부에서 스크롤바 사용유무
})
const emits = defineEmits([ 'close' ])
const confirmClose = ref(false)

watch(() => props.show, value => control(value))
onMounted(() => control(props.show))
onUnmounted(() => control(false))

function control(sw)
{
  if (!props.scroll) return
  document.querySelector('html').classList[sw ? 'add' : 'remove']('mode-modal')
}

function onPointerDown()
{
  confirmClose.value = true
}
function onPointerUp()
{
  if (confirmClose.value) emits('close')
  confirmClose.value = false
}
</script>

<style src="./modal.scss" lang="scss" scoped></style>
