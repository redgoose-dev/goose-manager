<template>
<header class="header">
  <h1>
    <Icon name="file-search"/>
    <span>{{props.title}}</span>
  </h1>
  <nav>
    <ButtonIcon
      v-if="props.useClose"
      icon-name="x"
      color="transparent"
      @click="emits('close')"/>
  </nav>
</header>
</template>

<script setup>
import { ButtonIcon } from '../button/index.js'
import Icon from '../icon/index.vue'

const props = defineProps({
  title: { type: String, default: '첨부파일 매니저' },
  useClose: Boolean,
})
const emits = defineEmits([ 'close' ])
</script>

<style src="./header.scss" lang="scss" scoped></style>
