<template>
<label :class="['form-radio', size && `form-radio--size-${size}`]">
  <input
    type="radio"
    :name="name"
    :id="id"
    :checked="computedChecked"
    :value="value"
    :disabled="disabled"
    :required="required"
    @change="onChange">
  <i class="form-radio__body"/>
</label>
</template>

<script>
export default {
  name: 'form-radio',
  props: {
    name: { type: String },
    id: { type: String },
    value: { type: [String,Number,Boolean], default: '' },
    checked: { type: [Boolean,Number,String], default: '' },
    disabled: { type: Boolean, default: false },
    size: { type: String, default: null },
    required: { type: Boolean, default: false },
  },
  model: {
    prop: 'checked',
    event: 'change',
  },
  computed: {
    computedChecked: {
      get()
      {
        return this.value === this.checked;
      },
      set(newValue)
      {
        this.$emit('change', this.value);
      },
    },
  },
  methods: {
    onChange(e)
    {
      this.$emit('change', e.target.value);
    },
  },
}
</script>

<style src="./radio.scss" lang="scss" scoped/>
