<template>
	<div class="rg-item rg-item-card">
		<figure v-if="!!image">
			<nuxt-link v-if="!!link" :to="link">
				<img :src="image" :alt="title"/>
			</nuxt-link>
			<img v-else :src="image" :alt="title"/>
		</figure>
		<div>
			<p class="rg-item__subject">
				<nuxt-link v-if="!!link" :to="link">
					<strong>{{subject}}</strong>
				</nuxt-link>
				<strong v-else>{{subject}}</strong>
			</p>
			<p v-if="!!description" class="rg-item__description">
				{{description}}
			</p>
			<p v-if="!!metas" class="rg-item__metas">
				<span v-for="(meta,key) in metas" v-if="meta" :key="key">{{meta}}</span>
			</p>
			<nav>
				<nuxt-link v-for="(nav,key) in navs" v-if="nav" :key="key" :to="nav.link">
					{{nav.label}}
				</nuxt-link>
			</nav>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		link: { type: String },
		image: { type: String },
		title: { type: String, default: 'item title' },
		subject: { type: String, default: 'item subject' },
		description: { type: String },
		metas: { type: Array },
		navs: { type: Array },
	},
}
</script>