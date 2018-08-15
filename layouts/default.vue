<template>
<main>
	<header class="header">
		<div class="header__wrap">
			<h1 class="logo">
				<nuxt-link to="/">
					<img src="/images/txt-logo.svg" alt="GOOSE"/>
				</nuxt-link>
			</h1>
			<nav class="gnb">
				<ul>
					<li><nuxt-link to="/apps">Apps</nuxt-link></li>
					<li><nuxt-link to="/nests">Nests</nuxt-link></li>
					<li v-if="isAdmin"><nuxt-link to="/users">Users</nuxt-link></li>
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
								<a href="/account" @click="onClickProfileItem">Account</a>
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
	computed: {
		isAdmin()
		{
			return !!this.$store.state.authUser.admin;
		}
	},
	methods: {
		onClickProfileItem(e)
		{
			e.preventDefault();
			const $el = e.currentTarget;
			// trigger blur
			$el.blur();
			// go to page
			this.$router.push($el.getAttribute('href'));
		}
	},
}
</script>

<style lang="scss" src="./default.scss" scoped></style>