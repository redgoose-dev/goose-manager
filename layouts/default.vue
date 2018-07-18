<template>
<main>
	<header class="header">
		<div class="header__wrap">
			<div>dfdgsdg</div>
		</div>
	</header>

	<div class="container">
		<div class="container__wrap">
			<nuxt/>
		</div>
	</div>

	<footer class="footer">
		<div class="footer__wrap">
			Copyright 2018 redgoose.me. All right reserved.
		</div>
	</footer>
</main>
</template>

<style lang="scss" scoped>
@import "../assets/scss/variables";

$size-side-max-padding: 100px;
$size-side-tablet-padding: 20px;

.header,
.container,
.footer {
	&__wrap {
		max-width: $size-container;
		padding: 0 $size-side-max-padding;
		margin: 0 auto;
		@media (max-width: $size-desktop) {
			max-width: none;
			padding: 0 $size-side-tablet-padding;
		}
	}
}

.header {
	background: $color-bar-background;
	height: $size-header-height;
	&__wrap {
		display: flex;
		margin: 0 auto;
		align-items: center;
		height: 100%;
		color: #fff;
	}
}
.container {

}
.footer {

}
</style>