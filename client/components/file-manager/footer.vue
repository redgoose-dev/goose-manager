<template>
<footer class="footer">
  <nav>
    <Dropdown
      v-if="fileManager.preference.useThumbnail"
      mode="hover"
      position="top-left"
      :disabled="!_useThumbnail"
      class="dropdown">
      <template #trigger>
        <ButtonBasic
          type="text"
          color="sub"
          icon-left="image"
          :disabled="!_useThumbnail"
          @click="onSelectContextFromThumbnail('preview')">
          썸네일 이미지
        </ButtonBasic>
      </template>
      <Context
        :items="[
          { key: 'preview', label: '이미지 프리뷰', iconLeft: 'scan-search' },
          { key: 'reset', label: '설정 리셋하기', iconLeft: 'rotate-ccw' },
        ]"
        @select="(e) => onSelectContextFromThumbnail(e.key)"/>
    </Dropdown>
  </nav>
  <nav>
    <Dropdown
      mode="hover"
      position="top-right"
      :disabled="!_useSubmit"
      class="dropdown">
      <template #trigger>
        <ButtonBasic
          type="text"
          color="key"
          icon-left="between-horizontal-start"
          :disabled="!_useSubmit"
          @click="onSelectContextFromSubmit('markdown')">
          첨부파일 삽입
        </ButtonBasic>
      </template>
      <Context
        :items="[
          { key: 'markdown', label: '마크다운 코드삽입', iconLeft: 'file-code-2' },
          { key: 'url', label: 'URL 주소삽입', iconLeft: 'link' },
          { key: 'html', label: 'HTML 코드삽입', iconLeft: 'code-xml' },
        ]"
        @select="(e) => onSelectContextFromSubmit(e.key)"/>
    </Dropdown>
  </nav>
</footer>
</template>

<script setup>
import { computed, inject } from 'vue'
import { ButtonBasic } from '../button/index.js'
import { Dropdown, Context } from '../navigation/dropdown/index.js'

const fileManager = inject('file-manager')

const _useThumbnail = computed(() => {
  // TODO
  return true
})
const _useSubmit = computed(() => {
  // TODO
  return true
})

function onSelectContextFromThumbnail(key)
{
  // TODO
  console.log('onSelectContextFromThumbnail()', key)
}

function onSelectContextFromSubmit(key)
{
  // TODO
  console.log('onSelectContextFromSubmit()', key)
}
</script>

<style src="./footer.scss" lang="scss" scoped></style>
