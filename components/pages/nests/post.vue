<template>
<form @submit="onSubmit" ref="form">
	<section class="rg-form-section">
		<h1>basic form</h1>
		<div class="rg-form-section__body">
			<dl class="rg-form-field">
				<dt><label for="nest_skin">Nest skin</label></dt>
				<dd>
					<form-checks
						type="radio"
						name="nest_skin"
						id="nest_skin"
						v-model="basicForms.nestSkin.value"
						:inline="true"
						:disabled="false"
						:items="[
							{ label: 'Default', value: 'default' },
							{ label: 'Advanced', value: 'advanced' },
						]"/>
					<p class="rg-form-help">
						skin을 변경하면 `extra form`의 항목이 변하는것을 주의하세요.
					</p>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="nest_skin">App</label></dt>
				<dd>
					select form
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="nest_skin">Article skin</label></dt>
				<dd>
					list of article skins<br/>
					TODO: 미리 변수화된 스킨 목록을 만들어두고 선택하게 하기
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="nest_skin">ID</label></dt>
				<dd>
					nest id
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="nest_skin">Name</label></dt>
				<dd>
					nest name
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="nest_skin">Size</label></dt>
				<dd>
					페이지당 글 갯수
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="nest_skin">Use category</label></dt>
				<dd>
					분류사용
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="nest_skin">권한설정</label></dt>
				<dd>
					읽기권한, 쓰기권한
				</dd>
			</dl>
		</div>
	</section>

	<nav class="rg-nav">
		<button-basic type="button" label="Back" onClick="history.back()" :inline="true"/>
		<button-basic
			type="submit"
			color="key"
			:label="!processing ? `Add Nest` : null"
			:inline="true"
			:icon="processing ? 'cached' : ''"
			:rotateIcon="processing"
			:disabled="processing"/>
	</nav>
</form>
</template>

<script>
// components
import FormText from '~/components/form/text';
import ButtonBasic from '~/components/button/basic';
import FormChecks from '~/components/form/checks';
// library
import { checkId, formData } from '~/libs/forms';
import * as messages from '~/libs/messages';
import * as articlePreference from '~/libs/articles/preference';

export default {
	components: {
		FormText,
		FormChecks,
		ButtonBasic,
	},
	props: {},
	data()
	{
		return {
			basicForms: {
				nestSkin: {
					value: 'default',
					error: null,
				},
				id: {
					value: '',
					error: null,
				},
				name: {
					value: '',
					error: null,
				},
			},
			extraForms: null,
			error: null,
			processing: false,
		};
	},
	mounted()
	{
		console.log(articlePreference.skin);
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();
			console.log('submit');
		}
	}
}
</script>