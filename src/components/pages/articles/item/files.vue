<template>
<section class="files">
  <h1 class="files__title">첨부파일</h1>
  <ul class="files__index">
    <li v-for="item in props.items" class="files__item">
      <a :href="createFullPath(item.path)" target="_blank">
        <span>{{item.name}}</span>
        <em>{{getByte(item.size)}}</em>
      </a>
    </li>
  </ul>
</section>
</template>

<script lang="ts" setup>
import { getByte } from '../../../../libs/string'
import { createFullPath } from '../../../../structure/files/util'

const props = defineProps<{
  items: any[]
}>()
</script>

<style src="./files.scss" lang="scss" scoped></style>
