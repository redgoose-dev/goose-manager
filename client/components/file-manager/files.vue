<template>
<ul>
  <li v-for="file in files">
    <File/>
  </li>
</ul>
</template>

<script setup>
import { ref } from 'vue'
import File from './file.vue'

const props = defineProps({
  files: Array,
  progress: Number,
})
</script>

<style src="./files.scss" lang="scss" scoped></style>
