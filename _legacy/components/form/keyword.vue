<template>
<div
  :class="[
    'form-keyword',
    formSize && `form-keyword--size-${formSize}`,
    disabled && `form-keyword--disabled`,
  ]">
  <p class="form-keyword__text">
    <input
      :type="type"
      :name="name"
      :id="id"
      :value="value"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :disabled="computedTextDisabled"
      :readonly="readonly"
      :required="required"
      @input="$emit('input', $event.target.value)"
      @keydown.enter="$emit('submit', value)"/>
  </p>
  <button
    type="button"
    :disabled="computedClearDisabled"
    class="form-keyword__clear"
    @click="$emit('clear')">
    <icon name="x-circle"/>
  </button>
  <button
    type="button"
    :disabled="computedSubmitDisabled"
    :class="[
      'form-keyword__submit',
      processing && 'processing',
    ]"
    @click="$emit('submit', value)">
    <icon v-if="processing" name="loader"/>
    <icon v-else name="search"/>
  </button>
</div>
</template>

<script>
export default {
  name: 'form-keyword',
  components: {
    'icon': () => import('~/components/icon'),
  },
  props: {
    type: { type: String, default: 'text' },
    id: { type: String },
    name: { type: String },
    value: { type: String },
    processing: { type: Boolean, default: false },
    formSize: { type: String }, // mini,small,large
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    maxlength: { type: Number },
    placeholder: { type: String, default: 'Please input keyword.' },
    required: { type: Boolean, default: false },
  },
  model: { prop: 'value', event: 'input' },
  computed: {
    computedTextDisabled()
    {
      return this.disabled || this.processing;
    },
    computedClearDisabled()
    {
      return !(this.value?.length > 0);
    },
    computedSubmitDisabled()
    {
      return this.processing;
    }
  },
}
</script>

<style src="./keyword.scss" lang="scss" scoped></style>
