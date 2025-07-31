<template>
<h3 :class="[
  'title',
  _tag !== 'strong' && 'title--link',
]">
  <component
    :is="_tag"
    v-bind="_rootProps"
    class="body"
    @click="emits('click:body', $event)">
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
const emits = defineEmits([ 'click:body' ])

const _tag = computed(() => (props.href ? 'a' : 'strong'))
const _rootProps = computed(() => {
  let attr = {}
  switch (_tag.value)
  {
    case 'a':
      attr.href = props.href || '#'
      if (props.target) attr.target = props.target
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
  font-size: 14px;
  letter-spacing: -.25px;
  @include mixins.text-single-line();
  &--link {
    color: var(--color-base);
    .body {
      text-decoration: none;
      color: var(--color-base);
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
