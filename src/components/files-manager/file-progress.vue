<template>
<div :class="[
  'progress',
  `progress--${localStore.attachmentTheme}`,
]">
  <div class="progress__wrap">
    <div class="progress__spinner">
      <Spinner/>
    </div>
    <p class="progress__body">Uploading..</p>
  </div>
</div>
</template>

<script setup>
import { fileManagerStore } from './store.js'
import Spinner from '../etc/spinner.vue'

const localStore = fileManagerStore()
</script>

<style src="./file-progress.scss" lang="scss" scoped></style>
