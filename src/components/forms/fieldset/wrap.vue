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
  tag: { type: String, default: 'fieldset' },
  legend: String,
  disabled: Boolean,
});
</script>

<style lang="scss" scoped>
@use '../../../assets/scss/mixins';
.fieldset {
  margin: 0;
  padding: 0;
  border: none;
  &__legend {
    display: block;
    margin: var(--fieldset-header-margin, (0 0 10px));
    padding: 0 0 0 12px;
    font-size: 20px;
    line-height: 1.15;
    font-weight: 700;
    letter-spacing: -.25px;
    user-select: none;
  }
  &__body {
    display: grid;
    border-top: 1px solid var(--fieldset-body-line, rgb(220 220 220));
    :slotted(> *) {
      border-bottom: 1px solid var(--fieldset-body-line, rgb(220 220 220));
    }
  }
  @include mixins.dark-mode() {
    --fieldset-body-line: rgb(68 68 68);
  }
}
</style>
