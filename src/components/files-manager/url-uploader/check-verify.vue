<template>
<div>
  check-verify
</div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(async () => {
  console.log('onMounted() / check-verify')
})

onUnmounted(() => {
  console.log('onUnmounted() / check-verify')
})
</script>
