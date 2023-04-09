<template>
<article class="guide">
  <h1 class="guide__title">커멘드 가이드</h1>
  <ul class="guide__body">
    <li>
      <p class="shortcut">
        <code>ESC</code>
      </p>
      <p class="description">윈도우를 닫습니다.</p>
    </li>
    <li>
      <p class="shortcut">
        <code>Ctrl(Cmd)</code> + <code>A</code>
      </p>
      <p class="description">모든파일을 선택합니다.</p>
    </li>
    <li>
      <p class="shortcut">
        <code>Ctrl(Cmd)</code> + <code>Enter</code>
      </p>
      <p class="description">선택된 파일을 에디터에 삽입합니다.</p>
    </li>
    <li>
      <p class="shortcut">
        <code>Tab</code>
      </p>
      <p class="description">다음 탭으로 이동합니다.</p>
    </li>
  </ul>
  <nav class="guide__nav">
    <ButtonBasic type="button" color="key" @click="emits('close')">
      닫기
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
