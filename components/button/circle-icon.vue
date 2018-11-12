<template>
	<button v-if="type" :type="type" :title="title" @click="onClick" :disabled="disabled" :class="classNames">
		<span>
			<i class="material-icons">{{name}}</i>
		</span>
	</button>
	<nuxt-link v-else-if="to" :to="to" :title="title" :class="classNames">
		<span>
			<i class="material-icons">{{name}}</i>
		</span>
	</nuxt-link>
	<a v-else :href="href" :target="target" :title="title" :class="classNames">
		<span>
			<i class="material-icons">{{name}}</i>
		</span>
	</a>
</template>

<script>
export default {
	props: {
		type: { type: String },
		to: { type: String },
		href: { type: String },
		target: { type: String },
		title: { type: String },
		name: { type: String, default: 'settings' },
		disabled: { type: Boolean, default: false },
		inline: { type: Boolean, default: false },
		size: { type: String }, // `small`, `large`
		color: { type: String }, // `key`, `gray`
		center: { type: Boolean, default: false },
		className: { type: String },
	},

	computed: {
		classNames: function()
		{
			return [
				'rg-button-circle-icon',
				this.size && `rg-button-circle-icon-size-${this.size}`,
				this.color && `rg-button-circle-icon-color-${this.color}`,
				this.inline && `rg-button-circle-icon-inline`,
				this.center && `rg-button-circle-icon-center`,
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
}
</script>