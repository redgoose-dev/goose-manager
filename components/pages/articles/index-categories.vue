<template>
<nav v-if="categories && categories.length" class="categories">
	<ul>
		<li v-for="(item,key) in categories">
			<nuxt-link :to="makeUrl(item.srl)" :class="[checkActive(item.srl) && 'active']">
				<span>{{item.name}}</span>
				<em>{{item.count_article}}</em>
			</nuxt-link>
		</li>
	</ul>
</nav>
</template>

<script>
export default {
	props: {
		nest_srl: { type: Number, default: null },
		categories: { type: Array },
		category_srl: { type: String, default: '' },
	},
	methods: {
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
			return `./${params}`;
		},
    checkActive(srl)
    {
      return (srl && srl === this.category_srl ? true : (!srl && !this.category_srl));
    },
	},
}
</script>

<style src="./index-categories.scss" lang="scss" scoped/>
