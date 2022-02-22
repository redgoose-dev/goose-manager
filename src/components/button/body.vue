<template>
<span class="button-body">
  <Icon
    v-if="props.iconLeft"
    :name="props.iconLeft"
    class="button-body__icon"/>
  <em
    v-if="$slots.default"
    class="button-body__label">
    <slot/>
  </em>
  <Icon
    v-if="props.iconRight"
    :name="props.iconRight"
    class="button-body__icon"/>
</span>
</template>

<script setup>
import Icon from '../icons/index.vue';

const props = defineProps({
  iconLeft: String,
  iconRight: String,
  rotateIcon: Boolean,
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
    box-sizing: border-box;
    @-webkit-keyframes spin {
      100% { transform: rotate(360deg); }
    }
    animation: var(--icon-animation, none);
    &:is(:first-child) {
      margin-right: 4px;
    }
    &:is(:last-child) {
      margin-left: 4px;
    }
  }
  &__label {
    display: block;
    font-style: normal;
    font-weight: 500;
    font-size: var(--font-size);
    line-height: 1.15;
    letter-spacing: -.25px;
    & + i {
      margin-left: 6px;
    }
  }
}
</style>
