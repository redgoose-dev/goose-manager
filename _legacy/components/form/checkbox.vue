<template>
<label :class="[
  'form-checkbox',
  size && `form-checkbox--size-${size}`,
]">
  <input
    type="checkbox"
    :name="name"
    :id="id"
    :value="value"
    :checked="checked"
    :disabled="disabled"
    @change="onChange">
  <i class="form-checkbox__body">
    <icon name="check" class="form-checkbox__icon"/>
  </i>
</label>
</template>

<script>
export default {
  name: 'form-checkbox',
  components: {
    'icon': () => import('~/components/icon'),
  },
  props: {
    name: { type: String },
    id: { type: String },
    value: { type: [String,Number,Boolean] },
    checked: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    size: { type: String, default: null },
  },
  model: {
    prop: 'checked',
    event: 'change',
  },
  methods: {
    onChange(e)
    {
      this.$emit('change', e.target.checked, e.target.value);
    },
  },
}
</script>

<style src="./checkbox.scss" lang="scss" scoped/>
