<template>
<nav v-if="categories && categories.length" class="rg-nav-bar">
	<ul>
		<li v-for="(item,key) in categories" :key="key">
			<a
				:href="makeUrl(item.srl)"
				:data-srl="item.srl"
				@click="onChange"
				:class="[
					(item.srl === category_srl) && 'active',
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
		category_srl: { type: String, default: '' },
	},
	methods: {
		onChange(e)
		{
			e.preventDefault();
			let srl = e.currentTarget.dataset.srl || '';
			if (this.category_srl === srl) return false;
			this.$emit('change', srl);
		},
		makeUrl(srl)
		{
			let params = '';
			switch(srl)
			{
				case '':
					params = '';
					break;
				case 'null':
					params = '?category=null';
					break;
				default:
					params = srl ? `?category=${srl}` : '';
					break;
			}
			return `/articles/index/${this.nest_srl}/${params}`;
		}
	}
}
</script>