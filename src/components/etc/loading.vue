<template>
<div :class="[
  'loading',
  move && 'loading-move'
]">
  <div v-if="show" class="loading__loader">
    <div class="loading__shadow"/>
    <div class="loading__box"/>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  move: Boolean,
})
let mounted = false
const show = ref(false)

onMounted(() => {
  mounted = true
  setTimeout(() => {
    if (mounted) show.value = true
  }, 240)
})
onUnmounted(() => {
  mounted = false
})
</script>

<style src="./loading.scss" lang="scss" scoped></style>
