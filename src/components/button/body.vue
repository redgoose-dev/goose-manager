<template>
<span class="button-body">
  <Icon
    v-if="props.iconLeft"
    :name="props.iconLeft"
    class="button-body__icon left"/>
  <em
    v-if="$slots.default"
    class="button-body__label">
    <slot/>
  </em>
  <Icon
    v-if="props.iconRight"
    :name="props.iconRight"
    class="button-body__icon right"/>
</span>
</template>

<script setup>
import Icon from '../icons/index.vue';

const props = defineProps({
  iconLeft: String,
  iconRight: String,
});
</script>

<style lang="scss" scoped>
.button-body {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 100%;
  &__icon {
    --icon-size: 18px;
    &.left {
      margin-left: -2px;
      & + em {
        margin-left: 6px;
      }
    }
    &.right {
      margin-right: -2px;
    }
  }
  &__label {
    display: block;
    font-style: normal;
    font-weight: 500;
    & + i {
      margin-left: 6px;
    }
  }
}
</style>
