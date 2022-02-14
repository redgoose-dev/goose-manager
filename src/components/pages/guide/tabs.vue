<template>
<nav class="tabs">
  <div class="tabs__wrap">
    <router-link to="/guide/" exact>Home</router-link>
    <router-link to="/guide/button/" exact>Button</router-link>
    <router-link to="/guide/form/">Form</router-link>
    <router-link to="/guide/fieldset/">Fieldset</router-link>
    <router-link to="/guide/icon/">Icon</router-link>
    <router-link to="/guide/color/">Color</router-link>
    <router-link to="/guide/file/">File</router-link>
    <router-link to="/guide/modal/">Modal</router-link>
    <router-link to="/guide/item/">Item</router-link>
    <router-link to="/guide/etc/">ETC</router-link>
  </div>
</nav>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.tabs {
  &__wrap {
    display: flex;
    align-items: center;
    padding: 0 15px;
    background-color: rgb(204 204 204 / 40%);
    border-radius: 2px;
    user-select: none;
  }
  a {
    display: block;
    padding: 12px 12px;
    text-decoration: none;
    font-weight: 500;
    font-size: 14px;
    border-radius: 2px;
    &:active {
      opacity: .5;
    }
    &:hover {
      background-color: rgb(0 0 0 / 5%);
    }
    &.router-link-exact-active {
      color: var(--color-base);
      cursor: default;
      opacity: 1;
      &:hover {
        background-color: transparent;
      }
    }
    &:focus-visible {
      outline: none;
    }
    &:focus-visible:not(.router-link-exact-active) {
      outline: none;
      box-shadow: 0 0 0 3px rgb(0 0 0 / 20%);
    }
  }
}
</style>
