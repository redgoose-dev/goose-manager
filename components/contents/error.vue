<template>
<div :class="[ 'rg-error', size && `rg-error-${size}` ]">
	<div class="rg-error__body">
		<i class="material-icons">{{iconName}}</i>
		<span>{{text}}</span>
	</div>
</div>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
	props: {
		type: { type: String, default: '' }, // {empty}
		icon: { type: String, default: '' },
		message: { type: String, default: null },
		size: { type: String, default: '' },
	},
	computed: {
		text()
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
		iconName()
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