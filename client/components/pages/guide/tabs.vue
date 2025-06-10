<template>
<nav class="tabs">
  <div class="tabs__wrap">
    <router-link to="/guide/" exact>Home</router-link>
    <router-link to="/guide/button/" exact>Button</router-link>
    <router-link to="/guide/forms/">Forms</router-link>
    <router-link to="/guide/fieldset/">Fieldset</router-link>
    <router-link to="/guide/icon/">Icon</router-link>
    <router-link to="/guide/color/">Color</router-link>
    <router-link to="/guide/modal/">Modal</router-link>
    <router-link to="/guide/item/">Item</router-link>
    <router-link to="/guide/etc/">ETC</router-link>
  </div>
</nav>
</template>

<style lang="scss" scoped>
@use '../../../scss/mixins';
.tabs {
  &__wrap {
    display: flex;
    align-items: center;
    height: 42px;
    padding: 0 12px;
    background-color: var(--color-edge);
    border-radius: mixins.radius(42px);
    user-select: none;
    box-shadow: 0 0 0 .5px mixins.mix-alpha(var(--color-base), 15%);
  }
  a {
    display: grid;
    place-content: center;
    padding: 0 12px;
    height: 100%;
    text-decoration: none;
    font-weight: 500;
    font-size: 14px;
    border-radius: 0;
    transition: background-color 160ms ease-out;
    box-sizing: border-box;
    &:focus-visible {
      outline: none;
    }
    &:not(.router-link-exact-active) {
      &:active {
        opacity: .5;
      }
      &:hover {
        background-color: mixins.mix-alpha(var(--color-base), 6%);
      }
      &:focus-visible {
        outline-offset: -2px;
        outline: 2px dashed var(--button-focus-color, var(--color-sub));
      }
    }
    &.router-link-exact-active {
      color: var(--color-base);
      cursor: default;
      opacity: 1;
    }
  }
}
</style>
