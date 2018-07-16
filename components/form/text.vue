<template>
	<div
		v-if="label"
		:class="[
			'rg-form-field',
			inline && 'rg-form-field-inline',
			className
		]">
		<label :for="id">{{label}}</label>
		<input
			:type="type"
			:name="name"
			:id="id"
			:value="value"
			:placeholder="placeholder"
			:maxlength="maxlength"
			:required="required"
			:disabled="disabled"
			@input="onChange"
			:class="[
				'rg-form-text',
				!!error && 'rg-from-text-error',
				classNameInput
			]"/>
		<p v-if="!!error" class="rg-from-help rg-from-help-error">{{error}}</p>
		<p v-if="help" class="rg-from-help">{{help}}</p>
	</div>
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
		:class="[
			'rg-form-text',
			!!error && 'rg-from-text-error',
			className
		]"
		@input="onChange">
</template>

<script>
export default {
	props: {
		type: { type: String, default: 'text' },
		label: { type: String },
		name: { type: String, default: null },
		id: { type: String, default: null },
		value: { type: [String,Number], default: null },
		placeholder: { type: String, default: null },
		maxlength: { type: Number },
		required: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		inline: { type: Boolean, default: false },
		help: { type: String },
		error: { type: String },
		className: { type: String },
		classNameInput: { type: String },
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