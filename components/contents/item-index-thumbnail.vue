<template>
	<div class="rg-item rg-item-thumbnail">
		<figure class="rg-item-thumbnail__image">
			<template v-if="!!image">
				<a v-if="!!href" :href="href" :title="title" :target="target">
					<img :src="image" :alt="title"/>
				</a>
				<nuxt-link v-else-if="!!link" :to="link" :title="title">
					<img :src="image" :alt="title"/>
				</nuxt-link>
				<img v-else :src="image" :alt="title"/>
			</template>
			<template v-else>
				<a v-if="!!href" :href="href" :title="title" :target="target">
					<span><i class="material-icons">filter_drama</i></span>
				</a>
				<nuxt-link v-else-if="!!link" :to="link" :title="title">
					<span><i class="material-icons">filter_drama</i></span>
				</nuxt-link>
				<span v-else><i class="material-icons">filter_drama</i></span>
			</template>
		</figure>
		<div class="rg-item-thumbnail__body">
			<p class="rg-item__subject">
				<a v-if="!!href" :href="href" :target="target">
					<strong>{{subject}}</strong>
				</a>
				<nuxt-link v-else-if="!!link" :to="link">
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
		navs: { type: Array },
	},
}
</script>