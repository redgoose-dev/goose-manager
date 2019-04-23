<template>
<nav v-if="items && items.length">
	<button
		v-for="(item,key) in items"
		type="button"
		:disabled="active === key"
		@click="onClickItem(key, item)">
		{{item.label}}
	</button>
</nav>
</template>

<script>
// TODO: 아직 작업 덜했음.

export default {
	name: 'button-tab',
	props: {
		items: { type: Array, default: undefined },
		active: { type: Number, default: 0 },
	},
	methods: {
		onClickItem(key, item)
		{
			this.$emit('change', key, item);
		}
	},
}
</script>