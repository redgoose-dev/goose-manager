<template>
<a
  v-if="type === 'a'"
  :href="props.href"
  :target="props.target"
  :title="props.title"
  :class="classes"
  :style="props.styles">
  <Body
    :icon-left="props.iconLeft"
    :icon-right="props.iconRight">
    <slot/>
  </Body>
</a>
<router-link
  v-else-if="type === 'router'"
  :to="props.href"
  :title="props.title"
  :class="classes"
  :style="props.styles">
  <Body
    :icon-left="props.iconLeft"
    :icon-right="props.iconRight">
    <slot/>
  </Body>
</router-link>
<label
  v-else-if="type === 'label'"
  :title="props.title"
  :class="classes"
  :style="props.styles">
  <Body
    :icon-left="props.iconLeft"
    :icon-right="props.iconRight">
    <slot/>
  </Body>
</label>
<button
  v-else
  :type="type"
  :title="props.title"
  :disabled="props.disabled"
  :class="classes"
  :style="props.styles">
  <Body
    :icon-left="props.iconLeft"
    :icon-right="props.iconRight">
    <slot/>
  </Body>
</button>
</template>

<script setup>
import { computed } from 'vue';
import Body from './body.vue';

const props = defineProps({
  type: { type: String, default: 'button' }, // label,button,submit,reset
  label: String,
  href: String,
  target: String,
  title: String,
  disabled: Boolean,
  size: String, // mini,small,large
  color: String, // key,gray
  inline: Boolean,
  rotateIcon: Boolean,
  iconLeft: String,
  iconRight: String,
  className: String,
  styles: [ Object, Array ],
});
const classes = computed(() => ([
  'button',
  props.size && `button--size-${props.size}`,
  props.color && `button--color-${props.color}`,
  props.inline && `button--inline`,
  props.rotateIcon && `button--animation`,
  props.className,
]));
const type = computed(() => {
  if (props.href) return /^http/.test(props.href) ? 'a' : 'router';
  else return props.type || null;
});
</script>

<style src="./common.scss" lang="scss" scoped/>
<style src="./basic.scss" lang="scss" scoped/>
