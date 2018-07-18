<template>
	<label v-if="label" :class="classNames" :style="styles">
		<input :type="type"/>
		<i></i>
	</label>
	<label v-else :class="classNames" :style="styles">
		<span>
			<input :type="type"/>
			<i></i>
		</span>
		<em>{{label}}</em>
	</label>
</template>

<script>
// TODO: 체크박스나 라디오의 유닛과 레이블의 컴포넌트
export default {
	props: {

	},
	computed: {
		classNames: function()
		{
			return [
				'rg-form-check',
				this.className,
			];
		}
	},
}
</script>