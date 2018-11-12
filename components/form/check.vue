<template>
	<label
		v-if="label"
		:class="[
			'rg-form-check-label',
			disabled && 'rg-form-check-label-disabled'
		]">
		<span
			:class="[
				'rg-form-check',
				`rg-form-check-${this.typeName}`,
			]">
			<input
				:type="typeName"
				:name="name"
				:id="id"
				:value="value"
				:checked="checked"
				:disabled="disabled"
				@change="onChange"/>
			<i></i>
		</span>
		<em>{{label}}</em>
	</label>
	<label
		v-else
		:class="[
			`rg-form-check`,
			`rg-form-check-${this.typeName}`,
			disabled && 'rg-form-check-disabled'
		]">
		<input
			:type="typeName"
			:name="name"
			:id="id"
			:value="value"
			:checked="checked"
			:disabled="disabled"
			@change="onChange"/>
		<i></i>
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