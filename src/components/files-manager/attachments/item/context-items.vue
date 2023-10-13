<template>
<ul>
  <template v-for="o in props.items">
    <li v-if="o === 'open-new-window'">
      <button type="button" @click="onClickItem(o)">
        새창으로 열기
      </button>
    </li>
    <li v-else-if="o === 'insert-markdown'">
      <button type="button" @click="onClickItem(o)">
        마크다운 코드삽입
      </button>
    </li>
    <li v-else-if="o === 'insert-raw'">
      <button type="button" @click="onClickItem(o)">
        첨부파일 삽입
      </button>
    </li>
    <li v-else-if="o === 'insert-address'">
      <button type="button" @click="onClickItem(o)">
        주소 삽입하기
      </button>
    </li>
    <li v-else-if="o === 'insert-html'">
      <button type="button" @click="onClickItem(o)">
        HTML 삽입하기
      </button>
    </li>
    <li v-else-if="o === 'set-thumbnail'">
      <button type="button" @click="onClickItem(o)">
        썸네일 이미지 설정
      </button>
    </li>
    <li v-else-if="o === 'delete'">
      <button type="button" class="color-error" @click="onClickItem(o)">
        삭제하기
      </button>
    </li>
  </template>
</ul>
</template>

<script setup>
const props = defineProps({
  items: Array,
})
const emits = defineEmits([ 'select' ])

function onClickItem(value)
{
  emits('select', value)
}
</script>

<style lang="scss" scoped>
@use '../../../../assets/scss/mixins';
ul {
  position: absolute;
  z-index: 2;
  margin: 0;
  padding: 0;
  list-style: none;
  background: rgb(255 255 255);
  box-sizing: border-box;
  min-width: 140px;
  box-shadow: 0 2px 16px rgb(var(--color-base-rgb) / 30%), 0 0 0 1px rgb(0 0 0 / 5%);
  border-radius: 4px;
  transition: opacity 200ms ease-out;
  :is(li + li) {
    border-top: 1px solid rgb(var(--color-base-rgb) / 15%);
  }
  :is(button) {
    display: block;
    width: 100%;
    white-space: nowrap;
    text-align: left;
    margin: 0;
    padding: 10px 20px 10px 12px;
    background: none;
    border: none;
    outline: none;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    color: var(--color-base);
    @include mixins.button-touch-options(false);
    &:active,
    &:hover {
      background-color: rgb(var(--color-base-rgb) / 8%);
    }
    &:is(.color-error) {
      color: var(--color-error);
    }
  }
  @include mixins.dark-mode() {
    background: rgb(36 36 36);
    box-shadow: 0 2px 16px rgb(0 0 0 / 40%), 0 0 0 1px rgb(60 60 60 / 100%);
    :is(li + li) {
      border-color: rgb(255 255 255 / 5%);
    }
    :is(button) {
      &:active,
      &:hover {
        background-color: rgb(0 0 0 / 30%);
      }
      &:is(.color-error) {
        color: var(--color-error);
      }
    }
  }
}
</style>
