<template>
<dl class="fieldset-field">
  <dt class="fieldset-field__label">
    <label v-if="label" :for="id">{{label}}</label>
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
    id: { type: String, default: null },
  },
}
</script>

<style src="./field.scss" lang="scss" scoped/>
