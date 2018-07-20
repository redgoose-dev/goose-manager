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
			<nav class="profile-nav">
				<div class="dropdown">
					<button type="button" class="dropdown__control" @click="toggleDropDown">
						<span>scripter@me.com</span>
						<i class="material-icons">arrow_drop_down</i>
					</button>
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
			<address>Copyright 2018 redgoose.me. All right reserved.</address>
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
	computed: {

	},
	methods: {
		toggleDropDown: function(e)
		{
			e.stopPropagation();
			const target = e.currentTarget;
			const activeElement = document.querySelector('.dropdown__control-active');
			if (activeElement && !target.classList.contains('dropdown__control-active'))
			{
				activeElement.classList.remove('dropdown__control-active');
				activeElement.nextSibling.classList.remove('dropdown__children-active');
			}
			target.classList.toggle('dropdown__control-active');
			target.nextSibling.classList.toggle('dropdown__children-active');
		}
	},
	mounted()
	{
		window.addEventListener('click', function() {
			const dropdowns = document.getElementsByClassName("dropdown__children");
			for (let i = 0; i < dropdowns.length; i++) {
				const openDropdown = dropdowns[i];
				if (openDropdown.classList.contains('dropdown__children-active')) {
					openDropdown.previousSibling.classList.remove('dropdown__control-active');
					openDropdown.classList.remove('dropdown__children-active');
				}
			}
		});
	},
}
</script>

<style lang="scss" src="./default.scss" scoped></style>
