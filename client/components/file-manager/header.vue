<template>
<header class="header">
  <h1>
    <Icon name="file-search"/>
    <span>첨부파일 매니저</span>
  </h1>
  <nav>
    <ButtonIcon
      v-if="_useClose"
      icon-name="x"
      color="transparent"
      @click="fileManagerEvent.close"/>
  </nav>
</header>
</template>

<script setup>
import { inject, computed } from 'vue'
import { ButtonIcon } from '../button/index.js'
import Icon from '../icon/index.vue'

const fileManager = inject('file-manager')
const fileManagerEvent = inject('file-manager-event')

const _useClose = computed(() => {
  return fileManager.preference.isWindow
})
</script>

<style src="./header.scss" lang="scss" scoped></style>
