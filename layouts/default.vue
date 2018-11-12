<template>
<main>
	<h1>{{appName}}</h1>
	<header class="header">
		<div class="header__wrap">
			<div class="logo">
				<nuxt-link to="/">
					<img src="/images/txt-logo.svg" alt="GOOSE"/>
				</nuxt-link>
			</div>
			<nav class="gnb">
				<ul>
					<li><nuxt-link to="/apps">Apps</nuxt-link></li>
					<li><nuxt-link to="/nests">Nests</nuxt-link></li>
					<li v-if="isAdmin"><nuxt-link to="/users">Users</nuxt-link></li>
					<li><nuxt-link to="/json">JSON</nuxt-link></li>
					<li><a href="https://github.com/redgoose-dev/goose-api/wiki" target="_blank">Documentation</a></li>
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
								<a href="#" @click="onClickClearTokens">Clear tokens</a>
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

<style lang="scss" src="./default.scss" scoped></style>
<script>
export default {
	name: 'layout',
	components: {
		'button-basic': () => import('~/components/button/basic'),
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
		},
		appName()
		{
			return this.$store.state.appName;
		},
	},
	methods: {
		onClickProfileItem(e)
		{
			e.preventDefault();
			// trigger blur
			e.currentTarget.blur();
			// go to page
			this.$router.push(e.currentTarget.getAttribute('href'));
		},
		async onClickClearTokens(e)
		{
			e.preventDefault();
			try
			{
				e.currentTarget.blur();
				const res = await this.$axios.$post('/token/clear');
				if (!res.success) throw 'error';
				alert('Success clear token');
			}
			catch (e)
			{
				this.$toast.add({
					message: 'Error clear token',
					color: 'error',
				});
			}
		}
	},
}
</script>
