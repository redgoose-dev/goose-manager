<template>
	<div :class="[
		'rg-loading',
		move && 'rg-loading-move',
	]">
		<div v-if="show" class="rg-loading__loader">
			<div class="rg-loading__shadow"></div>
			<div class="rg-loading__box"></div>
		</div>
	</div>
</template>

<script>
import * as util from '~/libs/util';

let mounted = false;

export default {
	props: {
		move: { type: Boolean, default: false }
	},
	data()
	{
		return { show: false };
	},
	mounted()
	{
		mounted = true;
		util.sleep(200).then(() => {
			if (mounted) this.show = true;
		});
	},
	beforeDestroy()
	{
		mounted = false;
	}
}
</script>