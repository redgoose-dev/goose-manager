<template>
<dl v-if="!!props.label" class="field">
  <dt class="field__label">
    <label :for="props.for">{{props.label}}</label>
  </dt>
  <dd class="field__body">
    <slot/>
  </dd>
</dl>
<div v-else class="field-full">
  <slot/>
</div>
</template>

<script setup>
const props = defineProps({
  label: String,
  for: String,
});
</script>

<style lang="scss" scoped>
@use '../../../scss/mixins';
.field {
  display: grid;
  grid-template-columns: var(--field-label-width, 150px) 1fr;
  grid-auto-flow: column;
  align-items: center;
  margin: 0;
  padding: 8px 0;
  box-sizing: border-box;
  min-height: 46px;
  &__label {
    padding: 0 0 0 12px;
    box-sizing: border-box;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: -.5px;
    line-height: 1.15;
    user-select: none;
  }
  &__body {
    margin: 0;
    padding: 0 12px 0 0;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 1.15;
    :deep(> *) {
      &:first-child {
        margin-top: 0;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
.field-full {
  margin: 0;
  padding: 12px 16px;
  box-sizing: border-box;
  min-height: 52px;
  font-size: 14px;
  line-height: 1.15;
  :deep(> *) {
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
