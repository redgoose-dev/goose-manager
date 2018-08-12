<template>
	<textarea
		v-if="(type === 'textarea')"
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
		@input="onChange"
		:class="[
			'rg-form-text',
			formSize && `rg-form-text-size-${formSize}`,
			error && 'rg-form-text-error',
			className
		]"
		:style="styles"></textarea>
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
		:size="size"
		@click="onChangePosition"
		@keyup="onChangePosition"
		@input="onChange"
		:class="[
			'rg-form-text',
			inline && 'rg-form-text-inline',
			formSize && `rg-form-text-size-${formSize}`,
			error && 'rg-form-text-error',
			className
		]"
		:style="styles"/>
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
		size: { type: [String,Number] },
		error: { type: Boolean },
		formSize: { type: String },
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
		},
		onChangePosition: function(e)
		{
			if (!('selectionStart' in e.target)) return;
			this.$emit('position', {
				start: e.target.selectionStart,
				end: e.target.selectionEnd
			});
		}
	}
}
</script>