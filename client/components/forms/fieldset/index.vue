<template>
<component
  :is="props.tag"
  :disabled="props.disabled"
  class="fieldset">
  <component
    v-if="props.legend"
    :is="props.tag === 'fieldset' ? 'legend' : 'h1'"
    class="fieldset__legend">
    {{props.legend}}
  </component>
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
  &__legend {
    display: block;
    margin: 0;
    padding: 0;
    font-size: 18px;
    line-height: 1.05;
    font-weight: 700;
    letter-spacing: -.25px;
    user-select: none;
  }
  &__body {
    display: grid;
    margin: 10px 0 0;
    border-top: 1px solid var(--color-blur);
    :slotted(> *) {
      border-bottom: 1px solid var(--color-blur);
    }
  }
}
</style>
