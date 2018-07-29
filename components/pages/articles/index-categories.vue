<template>
<nav v-if="categories && categories.length" class="rg-nav-bar">
	<ul>
		<li v-for="(item,key) in categories" :key="key">
			<a
				:href="`/articles/index/${nest_srl}${item.srl ? `?category=${item.srl}` : ''}`"
				:data-srl="item.srl"
				@click="onChange"
				:class="[ (parseInt(item.srl) === category_srl) && 'active' ]">
				<span>{{item.name}}</span>
				<em>{{item.count_article}}</em>
			</a>
		</li>
	</ul>
</nav>
</template>

<script>
export default {
	props: {
		nest_srl: { type: Number, default: 0 },
		categories: { type: Array },
		category_srl: { type: Number, default: 0 },
	},
	methods: {
		onChange(e)
		{
			e.preventDefault();
			let srl = parseInt(e.currentTarget.dataset.srl);
			if (this.category_srl === srl) return false;
			this.$emit('change', srl);
		}
	}
}
</script>