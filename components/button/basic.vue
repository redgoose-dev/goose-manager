<template>
	<button
		v-if="type"
		:type="type"
		:title="title"
		@click="onClick"
		:disabled="disabled"
		:class="classNames">
		<span>{{label}}</span>
		<i v-if="icon" class="material-icons">{{icon}}</i>
		<i v-if="loading">loading</i>
	</button>
	<nuxt-link
		v-else-if="link"
		:to="link"
		:title="title"
		:class="classNames">
		<span>{{label}}</span>
		<i v-if="icon" class="material-icons">{{icon}}</i>
	</nuxt-link>
	<a
		v-else
		:href="href"
		:target="target"
		:title="title"
		@onClick="onClick"
		:class="classNames">
		<span>{{label}}</span>
		<i v-if="icon" class="material-icons">{{icon}}</i>
	</a>
</template>

<script>
export default {
	props: {
		type: { type: String },
		label: { type: String, default: 'Button' },
		href: { type: String },
		target: { type: String },
		link: { type: String },
		title: { type: String },
		disabled: { type: Boolean, default: false },
		size: { type: String }, // `small`, `large`
		color: { type: String }, // `key`, `gray`
		inline: { type: Boolean, default: false },
		loading: { type: Boolean, default: false },
		icon: { type: String },
		className: { type: String },
	},

	computed: {
		classNames: function()
		{
			return [
				'rg-button',
				this.size && `rg-button-size-${this.size}`,
				this.color && `rg-button-color-${this.color}`,
				this.inline && `rg-button-inline`,
				this.className,
			];
		}
	},

	methods: {
		onClick: function(e)
		{
			this.$emit('onClick', e);
		}
	}
};
</script>
