<template>
<p :class="[
  'help',
  props.color && `color--${props.color}`,
]">
  <slot/>
</p>
</template>

<script setup>
const props = defineProps({
  color: String, // weak,key,sub,code,success,error
});
</script>

<style lang="scss" scoped>
.help {
  margin: 5px 0 0;
  font-size: 12px;
  line-height: 1.15;
  color: var(--help-color, var(--color-base));
}
.color {
  &--weak {
    --help-color: var(--color-weak);
  }
  &--key {
    --help-color: var(--color-key);
  }
  &--sub {
    --help-color: var(--color-sub);
  }
  &--code {
    --help-color: var(--color-code);
  }
  &--success {
    --help-color: var(--color-success);
  }
  &--error {
    --help-color: var(--color-error);
  }
}
</style>
