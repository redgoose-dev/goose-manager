<template>
<dl class="fieldset-field">
  <dt class="fieldset-field__label">
    <label v-if="label" :for="computedFor">{{label}}</label>
    <slot name="label"/>
  </dt>
  <dd class="fieldset-field__body">
    <slot name="body"/>
  </dd>
</dl>
</template>

<script>
export default {
  name: 'fieldset-field',
  props: {
    label: { type: String, default: null },
    for: { type: String, default: null },
  },
  computed: {
    computedFor()
    {
      return this.for;
    },
  },
}
</script>

<style src="./field.scss" lang="scss" scoped/>
