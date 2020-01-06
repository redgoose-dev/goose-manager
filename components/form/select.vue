<template>
  <div :class="[
    'form-select',
    this.size && `form-select--size-${this.size}`,
    this.inline && `form-select--inline`,
  ]">
    <label class="form-select__body">
      <select
        :name="name"
        :id="id"
        :value="selected"
        :required="required"
        :disabled="disabled"
        class="form-select__unit"
        @input="onChange">
        <template v-if="options && options.length">
          <option v-if="placeholder" value="">{{placeholder}}</option>
          <option v-for="item in options" :value="item.value">{{item.label}}</option>
        </template>
        <slot/>
      </select>
      <icon name="code" class="form-select__icon"/>
    </label>
  </div>
</template>

<script>
export default {
	props: {
		name: { type: String },
		id: { type: String },
		selected: { type: [String,Number], default: '' },
		options: { type: Array },
		required: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		inline: { type: Boolean, default: false },
		size: { type: String }, // mini,small,large
		placeholder: { type: String, default: 'Please select' },
	},
  components: {
	  'icon': () => import('~/components/icon'),
  },
	model: {
		prop: 'selected',
		event: 'change',
	},
	methods: {
		onChange(e)
		{
			this.$emit('change', e.target.value);
		},
	},
}
</script>

<style src="./select.scss" lang="scss" scoped/>
