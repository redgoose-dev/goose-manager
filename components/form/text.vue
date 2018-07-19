<template>
	<textarea
		v-if="(type === 'textarea')"
		:name="name"
		:id="id"
		:placeholder="placeholder"
		:maxlength="maxlength"
		:required="required"
		:disabled="disabled"
		:readonly="readonly"
		:rows="rows"
		:class="[
			'rg-form-text',
			size && `rg-form-text-size-${size}`,
			error && 'rg-form-text-error',
			className
		]"
		:style="styles"
		@input="onChange"
	>{{value}}</textarea>
	<input
		v-else
		:type="type"
		:name="name"
		:id="id"
		:value="value"
		:placeholder="placeholder"
		:maxlength="maxlength"
		:required="required"
		:disabled="disabled"
		:readonly="readonly"
		:class="[
			'rg-form-text',
			inline && 'rg-form-text-inline',
			size && `rg-form-text-size-${size}`,
			error && 'rg-form-text-error',
			className
		]"
		:style="styles"
		@input="onChange">
</template>

<script>
export default {
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
		rows: { type: Number, default: 8, },
		size: { type: String },
		error: { type: Boolean },
		className: { type: String },
		styles: { type: [Object,Array] },
	},
	model: {
		prop: 'value',
		event: 'change',
	},
	methods: {
		onChange: function(e)
		{
			this.$emit('change', e.target.value);
		}
	}
}
</script>