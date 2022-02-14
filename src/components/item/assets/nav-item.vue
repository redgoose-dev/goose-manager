<template>
<component
  :is="tag"
  v-bind="rootProps"
  class="nav-item"
  @click="onClickButton">
  <slot/>
</component>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  href: String,
  target: String,
  click: Function,
});
const tag = computed(() => {
  if (props.href) return /^http/.test(props.href) ? 'a' : 'router-link';
  else return 'button';
});
const rootProps = computed(() => {
  let attr = {};
  switch (tag.value)
  {
    case 'a':
      attr.href = props.href || '#';
      if (props.target) attr.target = props.target;
      break;
    case 'router-link':
      attr.to = props.href || '#';
      break;
    case 'button':
      attr.type = 'button';
      break;
  }
  return attr;
});

function onClickButton(e)
{
  if (!props.click) return;
  props.click(e);
}
</script>

<style lang="scss" scoped>
@use '../../../assets/scss/mixins';
.nav-item {
  display: block;
  line-height: 1.25;
  box-sizing: border-box;
  font-size: 12px;
  color: var(--color-base);
  font-weight: 600;
  @include mixins.button-touch-options(false);
  &:is(a) {
    text-decoration: none;
  }
  &:is(button) {
    margin: 0;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }
  &:hover {
    text-decoration: underline;
  }
}
</style>
