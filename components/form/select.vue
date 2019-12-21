<template>
<span :class="classNames">
	<select :name="name" :id="id" :value="selected" :required="required" :disabled="disabled" @input="onChange">
		<option value="">Please select</option>
		<option v-for="item in options" :value="item.value">
			{{item.label}}
		</option>
	</select>
  <icon name="code"/>
</span>
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
		size: { type: String },
		className: { type: String },
	},
  components: {
	  'icon': () => import('~/components/icon'),
  },
	model: {
		prop: 'selected',
		event: 'change',
	},
	computed: {
		classNames()
		{
			return [
				'form-select',
				this.size && `form-select-size-${this.size}`,
				this.inline && `form-select-inline`,
				this.className,
			];
		}
	},

	methods: {
		onChange(e)
		{
			this.$emit('change', e.target.value);
		}
	}
}
</script>

<style src="./select.scss" lang="scss" scoped/>
