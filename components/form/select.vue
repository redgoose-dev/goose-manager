<template>
	<span :class="classNames" :style="styles">
		<select
			:name="name"
			:id="id"

			:value="selected"
			:required="required"
			:disabled="disabled"
			@input="onChange">
			<option value="" selected>Please select</option>
			<option v-for="item in options" :value="item.value">
				{{item.label}}
			</option>
		</select>
		<i class="material-icons">unfold_more</i>
	</span>
</template>

<script>
export default {
	props: {
		name: { type: String },
		id: { type: String },
		selected: { type: String, default: '' },
		options: { type: Array },
		required: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		inline: { type: Boolean, default: false },
		size: { type: String },
		className: { type: String },
		styles: { type: [Object,Array] },
	},

	model: {
		prop: 'selected',
		event: 'change',
	},

	computed: {
		classNames: function()
		{
			return [
				'rg-form-select',
				this.size && `rg-form-select-size-${this.size}`,
				this.inline && `rg-form-select-inline`,
				this.className,
			];
		}
	},

	methods: {
		onChange: function(e)
		{
			this.$emit('change', e.target.value);
		}
	}
}
</script>