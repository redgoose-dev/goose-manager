<template>
<h3 :class="[
  'title',
  tag !== 'strong' && 'title--link',
]">
  <component :is="tag" v-bind="rootProps" class="title__body">
    <slot/>
  </component>
</h3>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  href: String,
  target: String,
});
const tag = computed(() => {
  if (props.href) return /^http/.test(props.href) ? 'a' : 'router-link';
  else return 'strong';
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
  }
  return attr;
});
</script>

<style lang="scss" scoped>
@use '../../../assets/scss/mixins';
.title {
  margin: 0;
  line-height: 1.25;
  word-break: break-all;
  font-size: 15px;
  @include mixins.text-single-line();
  &__body {
    color: var(--color-base);
    font-weight: 700;
  }
  &--link {
    color: var(--color-key);
    .title__body {
      text-decoration: none;
      color: var(--color-key);
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
