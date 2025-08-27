<template>
<div class="icon-preview">
  <ul class="">
    <li v-for="icon in _icons" @click="onClickItem">
      <div class="body">
        <Icon :name="icon" class="icon"/>
        <em>{{icon}}</em>
      </div>
    </li>
  </ul>
</div>
</template>

<script setup>
import { computed } from 'vue'
import icons from './map.js'
import Icon from './index.vue'

const _icons = computed(() => {
  return Object.keys(icons)
})

function onClickItem(e)
{
  const range = document.createRange()
  range.selectNodeContents(e.currentTarget.querySelector('em'))
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}
</script>

<style src="./preview.scss" lang="scss" scoped></style>
