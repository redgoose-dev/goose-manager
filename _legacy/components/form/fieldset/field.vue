<template>
<dl class="fieldset-field">
  <dt class="fieldset-field__label">
    <label v-if="label" :for="computedFor">{{label}}</label>
    <slot name="label"/>
  </dt>
  <dd class="fieldset-field__body">
    <slot name="body"/>
  </dd>
  <template v-if="label2">
    <dt class="fieldset-field__label">
      <label :for="computedFor2">{{label2}}</label>
    </dt>
    <dd class="fieldset-field__body">
      <slot name="body2"/>
    </dd>
  </template>
</dl>
</template>

<script>
export default {
  name: 'fieldset-field',
  props: {
    label: { type: String, default: null },
    for: { type: String, default: null },
    label2: { type: String, default: null },
    for2: { type: String, default: null },
  },
  computed: {
    computedFor()
    {
      return this.for;
    },
    computedFor2()
    {
      return this.for2;
    },
  },
}
</script>

<style src="./field.scss" lang="scss" scoped/>
