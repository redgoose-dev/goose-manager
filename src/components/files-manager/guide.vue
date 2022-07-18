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

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { controlWindow } from './util';
import { ButtonBasic } from '../button';

const emits = defineEmits([ 'close' ]);

onMounted(() => {
  controlWindow(true, 'guide');
});
onUnmounted(() => {
  controlWindow(false, 'guide');
});
</script>

<style lang="scss" scoped>
@use '../../assets/scss/mixins';
.guide {
  width: 420px;
  padding: 36px;
  box-sizing: border-box;
  &__title {
    margin: 0;
    font-family: var(--font-eng);
    font-size: 30px;
    letter-spacing: -1px;
    line-height: 1.25;
    text-align: center;
    font-weight: 600;
    text-transform: uppercase;
  }
  &__body {
    display: grid;
    gap: 8px;
    margin: 16px 0 0;
    padding: 0;
    list-style: none;
    li {
      margin: 0;
      padding: 12px 16px;
      background-color: rgb(var(--color-base-rgb) / 5%);
      border-radius: 2px;
      box-sizing: border-box;
    }
    .shortcut {
      margin: 0;
      font-size: 14px;
      code {
        font-size: 90%;
        display: inline-block;
        box-sizing: border-box;
        padding: 3px 8px;
        background-color: rgb(var(--color-weak-rgb) / 75%);
        border-radius: 2px;
        color: #fff;
        line-height: 1.2;
        font-weight: 600;
      }
    }
    .description {
      margin: 2px 0 0;
      font-size: 13px;
      letter-spacing: -.25px;
    }
  }
  &__nav {
    margin: 20px 0 0;
  }
}
</style>
