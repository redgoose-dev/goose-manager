<template>
<transition name="modal">
  <div
    v-if="props.show"
    class="modal"
    @click="emits('close')">
    <slot/>
  </div>
</transition>
</template>

<script setup>
import { watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show: Boolean,
  scroll: Boolean, // 내부에서 스크롤바 사용유무
})
const emits = defineEmits([ 'close' ])

function control(sw)
{
  if (!props.scroll) return
  document.querySelector('html').classList[sw ? 'add' : 'remove']('mode-modal')
}

watch(() => props.show, value => control(value))
onMounted(() => control(props.show))
onUnmounted(() => control(false))
</script>

<style src="./modal.scss" lang="scss" scoped></style>
