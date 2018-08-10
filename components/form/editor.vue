<template>
	<div>
		<form-text
			type="textarea"
			name="content"
			id="content"
			placeholder="article content body"
			v-model="value"
			:rows="15"
			:required="true"/>
	</div>
</template>

<script>
export default {
	components: {
		'FormText': () => import('~/components/form/text'),
	},
	props: {
		value: {},
	},
	model: {
		prop: 'value',
		event: 'change',
	},
	methods: {
		onChange(e)
		{
			console.log(e);
			this.$emit('change', e);
		}
	},
}
</script>