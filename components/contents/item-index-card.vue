<template>
	<div class="rg-item rg-item-card" :title="description">
		<figure v-if="!!image" class="rg-item-card__image">
			<a v-if="!!href" :href="href" :target="target">
				<img :src="image" :alt="title"/>
			</a>
			<nuxt-link v-else-if="!!link" :to="link">
				<img :src="image" :alt="title"/>
			</nuxt-link>
			<img v-else :src="image" :alt="title"/>
		</figure>
		<slot/>
		<div class="rg-item-card__body">
			<p class="rg-item__subject">
				<a v-if="!!href" :href="href" :target="target">
					<strong>{{subject}}</strong>
				</a>
				<nuxt-link v-else-if="!!link" :to="link">
					<strong>{{subject}}</strong>
				</nuxt-link>
				<strong v-else>{{subject}}</strong>
			</p>
			<p v-if="!!metas" class="rg-item__metas">
				<span v-for="(meta,key) in metas" v-if="meta" :key="key">{{meta}}</span>
			</p>
			<p v-if="!!metas2" class="rg-item__metas">
				<span v-for="(meta,key) in metas2" v-if="meta" :key="key">{{meta}}</span>
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
		href: { type: String },
		target: { type: String },
		image: { type: String },
		title: { type: String, default: 'item title' },
		subject: { type: String, default: 'item subject' },
		description: { type: String },
		metas: { type: Array },
		metas2: { type: Array },
		navs: { type: Array },
	},
}
</script>