<template>
<component
  :is="props.tag"
  :disabled="props.disabled"
  class="fieldset">
  <legend v-if="props.legend" class="sr-only">{{props.legend}}</legend>
  <div class="fieldset__body">
    <slot/>
  </div>
</component>
</template>

<script setup>
const props = defineProps({
  tag: { type: String, default: 'fieldset' }, // fieldset,section
  legend: String,
  disabled: Boolean,
});
</script>

<style lang="scss" scoped>
@use '../../../scss/mixins';
.fieldset {
  margin: 0;
  padding: 0;
  border: none;
  &__body {
    display: grid;
    margin: 0;
    :slotted(> .field:first-child) {
      border-top: 1px solid var(--color-blur);
    }
    :slotted(> *) {
      border-bottom: 1px solid var(--color-blur);
    }
  }
}
</style>
