<template>
<div class="field">
  <p v-if="props.label" class="field__label">
    <label :for="props.for">{{props.label}}</label>
  </p>
  <slot/>
</div>
</template>

<script setup>
const props = defineProps({
  label: String,
  for: String,
})
</script>

<style lang="scss" scoped>
.field {
  &__label {
    margin: 0 0 4px 0;
    font-size: 12px;
    font-weight: 600;
    color: var(--color-weak);
    user-select: none;
  }
}
</style>
