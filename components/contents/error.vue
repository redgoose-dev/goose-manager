<template>
<div :class="[
	'error',
	size && `error--size-${size}`,
	frame && `error--frame`,
]">
	<div class="error__body">
		<p class="error__icon">
			<i class="material-icons">{{computedIconName}}</i>
		</p>
		<p class="error__message">{{computedText}}</p>
	</div>
</div>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
	name: 'error',
	props: {
		type: { type: String, default: '' }, // empty
		icon: { type: String, default: '' }, // material design icon name
		message: { type: String, default: null },
		size: { type: String, default: '' }, // small,large
		frame: { type: Boolean, default: false },
	},
	computed: {
		computedText()
		{
			if (this.message) return this.message;

			switch(this.type)
			{
				case 'empty':
					return 'No results.';
				default:
					return messages.error.service;
			}
		},
		computedIconName()
		{
			if (this.icon) return this.icon;

			switch(this.type)
			{
				case 'empty':
					return 'not_interested';
				default:
					return 'error_outline';
			}
		}
	}
}
</script>

<style src="./error.scss" lang="scss" scoped/>
