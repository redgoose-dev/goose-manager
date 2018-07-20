<template>
<article>
	<page-header
		title="Test Flight"
		description="컴포넌트 테스트 페이지입니다."
	/>

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
		<button-basic href="/" icon="fingerprint" :inline="true" size="large"/>
	</p>
	<p>
		<button-basic
			type="button"
			label="Button: Button content"
			icon="fingerprint"
			:inline="true"/>
		&nbsp;
		<button-basic to="/" label="WWWWWWW" :inline="true"/>
		&nbsp;
		<button-basic type="button" label="disabled" :inline="true" :disabled="true"/>
	</p>

	<p>
		<a href="/">link style</a>
	</p>

	<hr>

	<p>
		<form-text
			placeholder="placeholder value"
			v-model="fooo"
			:required="true"
			:inline="false"
			:readonly="false"
			:disabled="false"
			size="small"
		/>
	</p>
	<p>
		<form-text
			placeholder="placeholder value"
			v-model="fooo"
			:required="true"
			:inline="false"
			:readonly="false"
			:disabled="false"
		/>
	</p>
	<p>
		<form-text
			placeholder="placeholder value"
			v-model="fooo"
			:required="true"
			:inline="false"
			:readonly="false"
			:disabled="true"
			size="large"
		/>
	</p>
	<hr>

	<form-text
		type="textarea"
		label="label name"
		id="fooo"
		placeholder="placeholder value"
		v-model="fooo"
		:required="true"
		:inline="true"
		help="help message"
	/>

	<hr>

	<button-circle-icon name="fingerprint" title="foo" size="small" :inline="true" color=""/>
	<button-circle-icon name="fingerprint" title="foo" size="" :inline="true" color="key"/>
	<button-circle-icon name="fingerprint" title="foo" size="large" :inline="true" color="gray"/>
	<button-circle-icon name="fingerprint" title="foo" size="" :inline="false" :center="true" color="key"/>
	<hr>

	<p>
		<form-select :inline="true" size="small"/>
		<form-select
			name="select_name"
			id="select_id"
			v-model="select"
			:options="[
				{ label: 'Foo', value: 'foo' },
				{ label: 'Bar', value: 'bar' }
			]"
			:inline="true"/>
		<form-select :inline="true" size="large"/>
		==={{select}}===
	</p>
	<hr>
	<p>
		<form-check
			name="foo23123oo"
			v-model="checkss"/>
		<form-check
			name="foooo"
			label="checkbox name"
			v-model="checkss"/>
		===========
		{{checkss}}
	</p>
	<p>
		<form-check
			type="radio"
			name="fooo1"
			label="radio name"
			v-model="checkss"
			:inline="true"/>
	</p>
	<hr>
	<div>
		<fieldset>
			<legend>checkbox group</legend>
			<form-checks
				type="checkbox"
				name="smdgpsd"
				id="roooo"
				:inline="true"
				v-model="checkboxes"
				:disabled="false"
				:items="[
					{ label: 'checks label#1', value: 'label-1' },
					{ label: 'checks label#2', value: 'label-2' },
					{ label: 'checks label#3', value: 'label-3' },
					{ label: 'checks label#4', value: 'label-4' },
					{ label: 'checks label#5', value: 'label-5' },
					{ label: 'checks label#6', value: 'label-6' },
					{ label: 'checks label#7', value: 'label-7' },
					{ label: 'checks label#8', value: 'label-8' },
				]"
				@change="(value) => { this.checkboxes = value }"
			/>
			<hr>
			{{checkboxes}}
		</fieldset>
		<fieldset>
			<legend>radio group</legend>
			<form-checks
				type="radio"
				name="rtjnfgh"
				id="yoooo"
				v-model="radios"
				:inline="true"
				:disabled="false"
				:items="[
					{ label: 'radio label#1', value: 'label-1' },
					{ label: 'radio label#2', value: 'label-2' },
					{ label: 'radio label#3', value: 'label-3' },
					{ label: 'radio label#4', value: 'label-4' },
					{ label: 'radio label#5', value: 'label-5' },
					{ label: 'radio label#6', value: 'label-6' },
					{ label: 'radio label#7', value: 'label-7' },
					{ label: 'radio label#8', value: 'label-8' },
				]"
			/>
			<hr>
			{{radios}}
		</fieldset>
		<fieldset>
			<legend>field style</legend>
			<div class="rg-form-field">
				<label for="sdmgmsdgp">label name</label>
				<form-text
					id="sdmgmsdgp"
					placeholder="placeholder value"
					:inline="true"
				/>
				<p class="rg-form-help rg-form-help-error">error message</p>
				<p class="rg-form-help">help message</p>
			</div>
		</fieldset>
	</div>
</article>
</template>

<script>
import PageHeader from '~/components/contents/page-header';
import ButtonBasic from '~/components/button/basic';
import ButtonCircleIcon from '~/components/button/circle-icon';
import FormText from '~/components/form/text';
import FormSelect from '~/components/form/select';
import FormCheck from '~/components/form/check';
import FormChecks from '~/components/form/checks';

export default {
	components: {
		PageHeader,
		ButtonBasic,
		ButtonCircleIcon,
		FormText,
		FormSelect,
		FormCheck,
		FormChecks,
	},
	data()
	{
		return {
			fooo: 'sdgmosdpg,sdg',
			select: 'foo',
			checkss: false,
			checkboxes: ['label-1', 'label-3', 'label-5'],
			radios: 'label-2',
		};
	}
}
</script>