<template>
  <label
    v-if="label"
    :class="[
      'form-check-label',
      disabled && 'form-check-label-disabled'
    ]">
    <span
      :class="[
        'form-check',
        `form-check-${this.typeName}`,
      ]">
      <input
        :type="typeName"
        :name="name"
        :id="id"
        :value="value"
        :checked="checked"
        :disabled="disabled"
        @change="onChange"/>
      <i/>
    </span>
    <em>{{label}}</em>
  </label>
  <label
    v-else
    :class="[
      `form-check`,
      `form-check-${this.typeName}`,
      disabled && 'form-check-disabled'
    ]">
    <input
      :type="typeName"
      :name="name"
      :id="id"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      @change="onChange"/>
    <i/>
  </label>
</template>

<script>
export default {
  props: {
    label: { type: String },
    type: { type: String, default: 'checkbox' },
    name: { type: String },
    id: { type: String },
    value: { type: [String,Number,Boolean] },
    checked: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    inline: { type: Boolean, default: false },
    change: {},
  },
  model: {
    prop: 'checked',
    event: 'change',
  },
  computed: {
    typeName: function()
    {
      return this.type === 'radio' ? 'radio' : 'checkbox';
    },
  },
  methods: {
    onChange: function(e)
    {
      switch (this.type)
      {
        case 'checkbox':
          this.$emit('change', e.target.checked, e);
          break;
        case 'radio':
          this.$emit('change', !!e.target.value ? e.target.value : e.target.checked, e);
          break;
      }

    }
  },
}
</script>

<style src="./check.scss" lang="scss" scoped/>
