<template>
<nav v-if="categories && categories.length" class="rg-nav-bar">
	<ul>
		<li v-for="(item,key) in categories" :key="key">
			<a
				:href="makeUrl(item.srl, item.type)"
				:data-srl="item.srl"
				:data-type="item.type"
				@click="onChange"
				:class="[
					(parseInt(item.srl) === category_srl) && 'active',
					item.type === type && 'active'
				]">
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
		type: { type: String, default: null }
	},
	methods: {
		onChange(e)
		{
			e.preventDefault();
			let srl = parseInt(e.currentTarget.dataset.srl) || 0;
			let type = e.currentTarget.dataset.type || null;
			if (this.category_srl === srl) return false;
			this.$emit('change', {srl, type});
		},
		makeUrl(srl, type)
		{
			let params = '';
			switch(type)
			{
				case 'all':
					params = '';
					break;
				case 'none':
					params = '?category_type=none';
					break;
				default:
					params = srl ? `?category=${srl}` : '';
					break;
			}
			return `/articles/index/${this.nest_srl}${params}`;
		}
	},
}
</script>