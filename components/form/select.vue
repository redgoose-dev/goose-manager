<template>
<select :name="name" :id="id">
	<option value="dgsdg">sdgsdgsdg</option>
</select>
</template>

<script>
export default {
	props: {
		name: { type: String },
		id: { type: String },
		options: { type: Array },
		className: { type: String },
		styles: { type: [Object,Array] },
	},

	computed: {
		classNames: function()
		{
			return [
				'rg-form-select',
				this.size && `rg-button-size-${this.size}`,
				this.inline && `rg-form-select-inline`,
				this.className,
			];
		}
	},
}
</script>