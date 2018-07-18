<template>
<article style="margin: 1rem;">
	<header class="rg-page-header">
		<h1 class="rg-page-header-title">Test Flight</h1>
		<p class="rg-page-header-description">분류를 관리하는 모듈입니다.</p>
	</header>

	<h2 class="rg-section-title">section title</h2>

	<p class="rg-text-body">
		ENG - Basic text<br/>
		<br/>
		The Somerset Levels are about 160,000 acres (650 km2) of coastal plains and wetlands in Somerset, South West England, running south from the Mendip Hills to the Blackdown Hills. About 70 per cent of the land is used as grassland and the rest is arable. Willow and teazel are grown commerc…<br/>
		<br/>
		KOR - 기본 텍스트 예제<br/>
		<br/>
		그러다 1910년 공화당 최강세 지역인 더치스 카운티에서 민주당 후보로 출마하여 뉴욕주 상원의원에 당선되어 정계에 입문한 후, 1913~1918년까진 제1차 세계대전도 겪으며 제프 대니얼스 해군 장관 아래에서 해군부 차관보를 역임한다. 이 때의 인연으로 그는 대통령 임기 내내 미합중국 해군에 굉장히 호의적이었다.<br/>
		<br/>
		이때부터 루즈벨트는 대니얼스 전 장관을 '보스'로 모셨는데, 이때 대니얼스는 루스벨트가 자기를 깐 적도 있지만 대인배스럽게 계속 그를 후원해주었다고 한다.
	</p>

	<p>
		<button-basic type="button" label="Button: Button content" size="small" icon="fingerprint"/>
	</p>
	<p>
		<button-basic type="button" label="Button: Button content" color="key" icon="fingerprint"/>
	</p>
	<p>
		<button-basic type="button" label="Button: Button content" size="large" color="gray" icon="fingerprint"/>
	</p>
	<p>
		<button-basic href="/" label="A: Button content"/>
	</p>
	<p>
		<button-basic
			type="button"
			label="Button: Button content"
			icon="fingerprint"
			:inline="true"/>
		&nbsp;
		<button-basic href="/" label="WWWWWWW" :inline="true"/>
		&nbsp;
		<button-basic type="button" label="disabled" :inline="true" :disabled="true"/>
	</p>
	<p><a href="/">link style</a></p>

	<hr>

	<form-text
		placeholder="placeholder value"
		v-model="fooo"
		:required="true"
		:inline="false"
		:readonly="false"
		:disabled="true"
	/>

	<hr>

	<form-text
		type="textarea"
		label="label name"
		id="fooo"
		placeholder="placeholder value"
		v-model="fooo"
		:required="true"
		:inline="false"

		help="help message"
	/>

	<hr>

</article>
</template>

<script>
import ButtonBasic from '~/components/button/basic';
import FormText from '~/components/form/text';

export default {
	components: {
		ButtonBasic,
		FormText,
	},
	data()
	{
		return {
			fooo: 'sdgmosdpg,sdg'
		};
	}
}
</script>