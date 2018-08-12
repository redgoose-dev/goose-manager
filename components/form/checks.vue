<template>
	<div :class="[
		'rg-form-checks',
		inline && 'rg-form-checks-inline',
		className
	]">
		<p v-for="(item,key) in items" :key="key">
			<form-check
				:type="typeName"
				:name="name"
				:id="id && (key === 0 ? id : `${id}_${key}`)"
				:label="item.label"
				:value="item.value"
				:disabled="disabled || item.disabled"
				:checked="confirmCheck(item.value)"
				@change="onChange"
			/>
		</p>
	</div>
</template>

<script>
import FormCheck from './check';

export default {
	components: {
		FormCheck,
	},
	props: {
		type: { type: String },
		items: { type: Array, default: [] },
		name: { type: String },
		id: { type: String },
		inline: { type: Boolean, default: false },
		value: { type: [Array,String,Number,Boolean] },
		change: {},
		disabled: { type: Boolean, default: false },
		className: { type: String },
		styles: { type: [Object,Array] },
	},
	model: {
		prop: 'value',
		event: 'change',
	},
	computed: {
		typeName: function()
		{
			return this.type === 'radio' ? 'radio' : 'checkbox';
		},
	},
	methods: {
		confirmCheck: function(currentValue)
		{
			switch (this.typeName)
			{
				case 'checkbox':
					return this.value.indexOf(currentValue) > -1;
				case 'radio':
					return currentValue === this.value;
			}
			return false;
		},
		onChange: function(value)
		{
			let newValue = null;

			switch(this.typeName)
			{
				case 'checkbox':
					newValue = Object.assign([], this.value);
					let n = newValue.indexOf(value);
					if (n > -1)
					{
						newValue.splice(n, 1);
					}
					else
					{
						newValue.push(value);
					}
					newValue.sort();
					break;

				case 'radio':
					newValue = value;
					break;
			}

			this.$emit('change', newValue);
		},
	},
}
</script>