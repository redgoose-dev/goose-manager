<template>
<div
	:style="styles"
	:class="[
		'rg-form-field',
		inline && 'rg-form-field-inline',
		className
	]">
	<label :for="id">{{label}}</label>
	<element-text
		:element="element"
		:type="type"
		:name="name"
		:id="id"
		:value="value"
		:error="!!error"
		:placeholder="placeholder"
		:maxlength="maxlength"
		:required="required"
		:disabled="disabled"
		:readonly="readonly"
		:inline="inline"
		:rows="rows"
		:className="classNameInput"
		:styles="stylesInput"
		@change="onChange"
	/>
	<p v-if="!!error" class="rg-form-help rg-form-help-error">{{error}}</p>
	<p v-if="!!help" class="rg-form-help">{{help}}</p>
</div>
</template>

<script>
import ElementText from './text';

export default {
	components: {
		ElementText,
	},
	props: {
		// field
		label: { type: String },
		help: { type: String },
		error: { type: String },
		className: { type: String },
		// input & textarea element
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
		classNameInput: { type: String },
		styles: { type: Object },
		stylesInput: { type: Object },
	},
	model: {
		prop: 'value',
		event: 'change',
	},
	methods: {
		onChange: function(text)
		{
			this.$emit('change', text);
		}
	}
}
</script>