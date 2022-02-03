<template>
<component v-bind:is="tag" class="fieldset-wrap">
  <div
    v-if="legend"
    :class="[
      `fieldset-wrap-legend`,
      hideLegend && `fieldset-wrap-legend--hide`,
    ]">
    <legend>{{legend}}</legend>
  </div>
  <div class="fieldset-wrap__body">
    <slot/>
  </div>
</component>
</template>

<script>
export default {
  name: 'fieldset-wrap',
  props: {
    tag: { type: String, default: 'fieldset' },
    legend: { type: String, default: null },
    hideLegend: { type: Boolean, default: false },
  },
}
</script>

<style src="./wrap.scss" lang="scss" scoped/>
