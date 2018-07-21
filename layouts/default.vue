<template>
<main>
	<header class="header">
		<div class="header__wrap">
			<h1 class="logo">
				<nuxt-link to="/">GOOSE</nuxt-link>
			</h1>
			<nav class="gnb">
				<ul>
					<li><nuxt-link to="/apps">Apps</nuxt-link></li>
					<li><nuxt-link to="/nests">Nests</nuxt-link></li>
					<li><nuxt-link to="/users">Users</nuxt-link></li>
					<li><nuxt-link to="/json">JSON</nuxt-link></li>
					<li><a href="https://github.com/redgoose-dev/goose-api/wiki" target="_blank">Documentation</a></li>
					<li><nuxt-link to="/test-flight">Test Flight</nuxt-link></li>
				</ul>
			</nav>
			<nav v-if="!!user" class="profile-nav">
				<div class="dropdown">
					<span class="dropdown__control">
						<em>{{user.email}}</em>
						<i class="material-icons">arrow_drop_down</i>
					</span>
					<div class="dropdown__children">
						<ul>
							<li>
								<nuxt-link to="/">Account</nuxt-link>
							</li>
							<li>
								<nuxt-link to="/auth/logout">Logout</nuxt-link>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</div>
	</header>

	<div class="container">
		<div class="container__wrap">
			<nuxt/>
		</div>
	</div>

	<footer class="footer">
		<div class="footer__wrap">
			<address>
				Copyright © 2014-{{year}} <a href="https://redgoose.me" target="_blank">redgoose.me</a>
			</address>
		</div>
	</footer>
</main>
</template>

<script>
import ButtonBasic from '~/components/button/basic';

export default {
	components: {
		ButtonBasic,
	},
	data()
	{
		const { $store } = this;
		return {
			user: $store.state.authUser || null,
			year: new Date().getFullYear()
		};
	},
	computed: {},
	methods: {},
}
</script>

<style lang="scss" src="./default.scss" scoped></style>