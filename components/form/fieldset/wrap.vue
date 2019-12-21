<template>
<fieldset class="fieldset-wrap">
  <div v-if="legend" class="fieldset-wrap__legend">
    <legend>{{legend}}</legend>
  </div>
  <div class="fieldset-wrap__body">
    <slot/>
  </div>
</fieldset>
</template>

<script>
export default {
  name: 'fieldset-wrap',
  props: {
    legend: { type: String, default: null },
  },
}
</script>

<style src="./wrap.scss" lang="scss" scoped/>
