<template>
<p :class="[
  'help',
  props.color && `help--color-${props.color}`,
]">
  <slot/>
</p>
</template>

<script setup>
const props = defineProps({
  color: String, // key,sub,error
});
</script>

<style lang="scss" scoped>
.help {
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.15;
  color: var(--color-weak);
  &--color {
    &-key {
      color: var(--color-key);
    }
    &-sub {
      color: var(--color-sub);
    }
    &-error {
      color: var(--color-error);
    }
  }
}
</style>
