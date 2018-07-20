<template>
	<button
		v-if="type"
		:type="type"
		:title="title"
		@click="onClick"
		:disabled="disabled"
		:class="classNames"
		:style="styles">
		<span v-if="label">{{label}}</span>
		<i v-if="icon" :class="['material-icons', !label && 'solo']">{{icon}}</i>
	</button>
	<nuxt-link
		v-else-if="to"
		:to="to"
		:title="title"
		:class="classNames"
		:style="styles">
		<span v-if="label">{{label}}</span>
		<i v-if="icon" :class="['material-icons', !label && 'solo']">{{icon}}</i>
	</nuxt-link>
	<a
		v-else
		:href="href"
		:target="target"
		:title="title"
		@onClick="onClick"
		:class="classNames"
		:style="styles">
		<span v-if="label">{{label}}</span>
		<i v-if="icon" :class="['material-icons', !label && 'solo']">{{icon}}</i>
	</a>
</template>

<script>
export default {
	props: {
		type: { type: String },
		label: { type: String, default: '' },
		href: { type: String },
		to: { type: String },
		target: { type: String },
		title: { type: String },
		disabled: { type: Boolean, default: false },
		size: { type: String }, // `small`, `large`
		color: { type: String }, // `key`, `gray`
		inline: { type: Boolean, default: false },
		rotateIcon: { type: Boolean, default: false },
		icon: { type: String },
		className: { type: String },
		styles: { type: [Object,Array] },
	},

	computed: {
		classNames: function()
		{
			return [
				'rg-button',
				this.size && `rg-button-size-${this.size}`,
				this.color && `rg-button-color-${this.color}`,
				this.inline && `rg-button-inline`,
				this.rotateIcon && `rg-button-rotate-icon`,
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
