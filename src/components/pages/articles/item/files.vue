<template>
<section class="files">
  <h1 class="files__title">
    Attachment files
  </h1>
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

<script setup>
import { getByte } from '../../../../libs/string';
import { createFullPath } from '../../../../structure/files/util';
const props = defineProps({
  items: Array,
});
</script>

<style lang="scss" scoped>
@use '../../../../assets/scss/mixins';
.files {
  padding: 20px;
  background: var(--files-bg, rgb(var(--color-base-rgb) / 5%));
  border-radius: 2px;
  box-shadow: var(--files-shadow, 0 0 0 1px rgb(var(--color-base-rgb) / 20%));
  &__title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.05;
    font-family: var(--font-eng);
    letter-spacing: -.5px;
  }
  &__index {
    display: flex;
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
    flex-wrap: wrap;
    gap: 6px 12px;
  }
  &__item {
    display: block;
    a {
      display: block;
      font-size: 11px;
      font-weight: 400;
      line-height: 1.15;
      text-decoration: none;
      letter-spacing: -.25px;
      &:hover {
        text-decoration: underline;
      }
    }
    em {
      font-style: normal;
      &:before {
        content: ' (';
      }
      &:after {
        content: ')';
      }
    }
  }
  @include mixins.dark-mode() {
    --files-bg: rgb(var(--color-base-rgb) / 5%);
    --files-shadow: 0 0 0 1px rgb(var(--color-base-rgb) / 15%);
  }
}
</style>
