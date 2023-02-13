<template>
<article class="guide">
  <h1 class="guide__title">Command guide</h1>
  <ul class="guide__body">
    <li>
      <p class="shortcut">
        <code>ESC</code>
      </p>
      <p class="description">close window</p>
    </li>
    <li>
      <p class="shortcut">
        <code>Ctrl(Cmd)</code> + <code>A</code>
      </p>
      <p class="description">Select all items</p>
    </li>
    <li>
      <p class="shortcut">
        <code>Ctrl(Cmd)</code> + <code>Enter</code>
      </p>
      <p class="description">Insert the selected item into the editor</p>
    </li>
    <li>
      <p class="shortcut">
        <code>Tab</code>
      </p>
      <p class="description">Change next tab</p>
    </li>
  </ul>
  <nav class="guide__nav">
    <ButtonBasic type="button" color="key" @click="emits('close')">
      Close
    </ButtonBasic>
  </nav>
</article>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { controlWindow } from './util'
import { ButtonBasic } from '../button'

const emits = defineEmits([ 'close' ])

onMounted(() => {
  controlWindow(true, 'guide')
})
onUnmounted(() => {
  controlWindow(false, 'guide')
})
</script>

<style src="./guide.scss" lang="scss" scoped></style>
