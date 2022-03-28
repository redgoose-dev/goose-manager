<template>
<nav class="tabs">
  <router-link v-for="o in tree" :to="o.to" class="tabs__link">
    <strong>{{o.label}}</strong>
    <Icon name="chevron-right"/>
  </router-link>
</nav>
</template>

<script setup>
import { ref } from 'vue';
import Icon from '../../icons/index.vue';

const tree = ref([
  { label: 'General', to: '/preference/' },
  { label: 'Dashboard', to: '/preference/dashboard/' },
  { label: 'Navigation', to: '/preference/navigation/' },
  { label: 'Nests', to: '/preference/nests/' },
  { label: 'Articles', to: '/preference/articles/' },
  { label: 'Files', to: '/preference/files/' },
  { label: 'Checklist', to: '/preference/checklist/' },
]);
</script>

<style lang="scss" scoped>
.tabs {
  position: sticky;
  top: calc(var(--size-header-height) + 36px);
  left: 0;
  right: 0;
  display: grid;
  gap: 0;
  border-radius: var(--size-radius);
  box-shadow: 0 0 0 1px rgb(var(--color-invert-rgb) / 75%), 0 2px 15px rgb(var(--color-base-rgb) / 15%);
  overflow: hidden;
  user-select: none;
  &__link {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 0;
    font-size: 13px;
    padding: 8px 16px;
    color: var(--color-base);
    text-decoration: none;
    letter-spacing: -.25px;
    transition: filter 120ms ease-out;
    background: rgb(var(--color-invert-rgb) / 100%);
    strong {
      display: block;
      flex: 1;
      font-weight: 600;
    }
    svg {
      display: block;
      opacity: 0;
      margin: -2px -4px -2px 0px;
      pointer-events: none;
      --icon-color: var(--color-invert);
      --icon-size: 20px;
      --icon-stroke-width: 2.4;
    }
    &:hover:not(.router-link-exact-active) {
      filter: brightness(95%);
    }
    &:active:not(.router-link-exact-active) {
      filter: brightness(92%);
    }
    &.router-link-exact-active {
      color: rgb(var(--color-invert-rgb) / 100%);
      cursor: default;
      background: rgb(var(--color-weak-rgb) / 40%);
      svg {
        opacity: 1;
      }
    }
  }
}
</style>
