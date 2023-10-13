<template>
<div class="dropdown">
  <ButtonBasic
    type="button"
    size="small"
    color="key"
    icon-left="upload"
    @click="emits('upload-file')">
    업로드
  </ButtonBasic>
  <div class="context">
    <ul>
      <li>
        <button type="button" @click="emits('upload-file')">
          <Icon name="upload"/>
          <span>파일 업로드</span>
        </button>
      </li>
      <li>
        <button type="button" @click="emits('upload-url')">
          <Icon name="link-2"/>
          <span>URL 업로드</span>
        </button>
      </li>
    </ul>
  </div>
</div>
</template>

<script setup>
import { ButtonBasic } from '../../../button'
import Icon from '../../../icons/index.vue'

const emits = defineEmits([ 'upload-file', 'upload-url' ])
</script>

<style lang="scss" scoped>
@use '../../../../assets/scss/mixins';
.dropdown {
  position: relative;
  &:hover > :is(.context) {
    opacity: 1;
    pointer-events: auto;
  }
}
.context {
  padding: 6px 0 0;
  position: absolute;
  left: -6px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 160ms ease-out;
}
ul {
  --context-radius: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  z-index: 2;
  min-width: 140px;
  background: hsl(0 0% 100%);
  border-radius: var(--context-radius);
  box-shadow: 0 2px 8px 0 hsla(0 0% 0% / 30%), 0 0 0 .5px hsla(0 0% 0% / 10%);
  @include mixins.dark-mode() {
    background: hsl(0 0% 14%);
    box-shadow: 0 2px 16px 0 hsla(0 0% 0% / 40%), 0 0 0 .5px hsl(0 0% 24%);
  }
}
li {
  &:nth-child(n+2) {
    border-top: 1px solid hsl(0 0% 85%);
  }
  &:first-child {
    border-radius: var(--context-radius) var(--context-radius) 0 0;
  }
  &:last-child {
    border-radius: 0 0 var(--context-radius) var(--context-radius);
  }
  &:hover {
    background: hsla(0 0% 0% / 8%);
  }
  @include mixins.dark-mode() {
    &:nth-child(n+2) {
      border-top: 1px solid hsl(0 0% 100% / 5%);
    }
  }
}
button {
  display: flex;
  align-items: center;
  gap: 0 8px;
  width: 100%;
  margin: 0;
  padding: 10px 16px;
  text-align: left;
  border-radius: 0;
  border: none;
  background: none;
  --icon-size: 12px;
  --icon-stroke: 2.5;
  @include mixins.button-touch-options(true);
  span {
    flex: 1;
    display: block;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.15;
  }
}
</style>
