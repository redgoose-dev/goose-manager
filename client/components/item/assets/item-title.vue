<template>
<h3 :class="[
  'title',
  _tag !== 'strong' && 'title--link',
]">
  <component
    :is="_tag"
    v-bind="_rootProps"
    class="body">
    <slot/>
  </component>
</h3>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  href: [ String, Object ],
  target: String,
})

const _tag = computed(() => {
  if (props.href)
  {
    if (typeof props.href === 'string')
    {
      return /^http/.test(props.href) ? 'a' : 'router-link'
    }
    else
    {
      return 'router-link'
    }
  }
  else
  {
    return 'strong'
  }
})
const _rootProps = computed(() => {
  let attr = {}
  switch (_tag.value)
  {
    case 'a':
      attr.href = props.href || '#'
      if (props.target) attr.target = props.target
      break
    case 'router-link':
      attr.to = props.href || '#'
      break
  }
  return attr
})
</script>

<style lang="scss" scoped>
@use '../../../scss/mixins';
.title {
  margin: 0;
  line-height: 1.05;
  word-break: break-all;
  font-size: 15px;
  letter-spacing: -.25px;
  @include mixins.text-single-line();
  &--link {
    color: var(--color-key);
    .body {
      text-decoration: none;
      color: var(--color-key);
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
.body {
  color: var(--color-base);
  font-weight: 700;
}
</style>
