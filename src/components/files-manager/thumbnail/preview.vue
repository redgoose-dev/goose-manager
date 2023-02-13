<template>
<figure class="thumbnail-preview">
  <img :src="image" alt="" class="thumbnail-preview__image">
  <button
    type="button"
    title="Close"
    class="thumbnail-preview__close"
    @click="emits('close')">
    <Icon name="x"/>
  </button>
</figure>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { controlWindow } from '../util'
import Icon from '../../icons/index.vue'

const props = defineProps<{
  image: string
}>()
const emits = defineEmits([ 'close' ])

onMounted(() => {
  controlWindow(true, 'thumbnail-preview')
})
onUnmounted(() => {
  controlWindow(false, 'thumbnail-preview')
});
</script>

<style src="./preview.scss" lang="scss" scoped></style>
