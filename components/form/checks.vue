<template>
	<div :class="['form-checks', inline && 'form-checks-inline']">
		<p v-for="(item,key) in items" :key="key">
			<form-check
				:type="typeName"
				:name="name"
				:id="id && (key === 0 ? id : `${id}_${key}`)"
				:label="item.label"
				:value="item.value"
				:disabled="disabled || item.disabled"
				:checked="confirmCheck(item.value)"
				@change="onChange"/>
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
	},
	model: {
		prop: 'value',
		event: 'change',
	},
	computed: {
		typeName()
		{
			return this.type === 'radio' ? 'radio' : 'checkbox';
		},
	},
	methods: {
		confirmCheck(currentValue)
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
		onChange(value)
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

<style src="./checks.scss" lang="scss" scoped/>
