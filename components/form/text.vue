<template>
  <textarea
    v-if="(type === 'textarea')"
    ref="body"
    :name="name"
    :id="id"
    :value="value"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :rows="rows"
    :size="size"
    @click="onChangePosition"
    @keyup="onChangePosition"
    @keyup.ctrl.enter="onSubmit"
    @input="onChange"
    :class="[
      'form-text',
      'form-text--textarea',
      formSize && `form-text--size-${formSize}`,
      error && 'form-text--error',
      className
    ]"/>
  <input
    v-else
    ref="body"
    :type="type"
    :name="name"
    :id="id"
    :value="value"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :size="size"
    @click="onChangePosition"
    @keyup="onChangePosition"
    @input="onChange"
    :class="[
      'form-text',
      inline && 'form-text--inline',
      formSize && `form-text--size-${formSize}`,
      error && 'form-text--error',
      className
    ]"/>
</template>

<script>
export default {
  name: 'form-text',
  props: {
    element: { type: String, default: 'input' },
    type: { type: String, default: 'text' },
    name: { type: String, default: null },
    id: { type: String, default: null },
    value: { type: [String,Number], default: null },
    placeholder: { type: String, default: null },
    maxlength: { type: Number },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    inline: { type: Boolean, default: false },
    rows: { type: Number, default: 4, },
    size: { type: [String,Number] },
    error: { type: Boolean },
    formSize: { type: String },
    submitEvent: { type: Boolean, default: false },
    className: { type: String },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  mounted()
  {
    if (!this.$body)
    {
      this.$nextTick(() => {
        this.$body = this.$refs.body;
        if (this.type === 'textarea') this.changeHeight();
      });
    }
  },
  methods: {
    onChange(e)
    {
      if (this.type === 'textarea') this.changeHeight();
      this.$emit('change', e.target.value);
    },
    onChangePosition(e)
    {
      if (!('selectionStart' in e.target)) return;
      this.$emit('position', {
        start: e.target.selectionStart,
        end: e.target.selectionEnd
      });
    },
    changeHeight()
    {
      if (!this.$body) return;
      this.$body.style.height = `auto`;
      this.$body.style.height = `${this.$body.scrollHeight}px`;
    },
    onSubmit()
    {
      if (!this.submitEvent) return;
      this.$emit('submit');
    },
    focus()
    {
      this.$body.focus();
    },
  },
}
</script>

<style src="./text.scss" lang="scss" scoped/>
