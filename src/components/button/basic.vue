<template>
<component :is="tag" v-bind="rootProps">
  <ButtonBody v-bind="bodyProps">
    <slot v-if="$slots.default"/>
  </ButtonBody>
</component>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import ButtonBody from './button-body.vue';

interface Props {
  type?: 'label' | 'button' | 'submit' | 'reset'
  label?: string
  href?: string
  target?: string
  title?: string
  disabled?: boolean
  size?: 'small'
  color?: 'key' | 'sub' | 'error' | 'weak'
  inline?: boolean
  rotateIcon?: boolean
  iconLeft?: string
  iconRight?: string
  className?: string
  styles?: object|any[]
}

const props = defineProps<Props>();
const type = computed<any>(() => {
  if (props.href) return /^http/.test(props.href) ? 'a' : 'router';
  else return props.type || 'button';
});
const bodyProps = computed<any>(() => {
  return {
    iconLeft: props.iconLeft,
    iconRight: props.iconRight,
    rotateIcon: props.rotateIcon,
  };
});
const tag = computed<string>(() => {
  switch (type.value)
  {
    case 'a': return 'a';
    case 'router': return 'router-link';
    case 'label': return 'label';
    default: return 'button';
  }
});
const rootProps = computed<any>(() => {
  let attr: any = {};
  if (props.title) attr.title = props.title;
  switch (type.value)
  {
    case 'a':
      attr.href = props.href || '#';
      if (props.target) attr.target = props.target;
      break;
    case 'router':
      attr.to = props.href || '#';
      break;
    case 'label':
      if (props.disabled) attr.disabled = props.disabled;
      break;
    default:
      attr.type = props.type || 'button'
      if (props.disabled) attr.disabled = props.disabled
      break;
  }
  attr.class = [
    'button',
    props.size && `button--size-${props.size}`,
    props.color && `button--color-${props.color}`,
    props.inline && `button--inline`,
    props.rotateIcon && `button--animation`,
    props.className,
  ];
  attr.style = props.styles;
  return attr;
});
</script>

<style src="./basic.scss" lang="scss" scoped/>
