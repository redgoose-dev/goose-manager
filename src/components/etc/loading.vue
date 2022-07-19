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

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  move?: boolean
}>()
let mounted = false
const show = ref<boolean>(false)

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
