<template>
<article>
  <header class="section-header">
    <h1 class="section-header__title">Navigation</h1>
    <p class="section-header__description">
      매니저 상단 네비게이션 구조를 편집합니다.
    </p>
  </header>
  <form class="code-form" @submit.prevent="onSubmit">
    <fieldset class="code-form__fieldset">
      <legend>Navigation forms</legend>
      <div class="field">
      <Textarea
        v-model="fields.code.value"
        placeholder="Please input code"
        :auto-size="false"
        :rows="16"
        @submit="onSubmit"/>
        <Help>JSON 형식의 소스코드이니 코드 작성에 주의해 주세요.</Help>
      </div>
    </fieldset>
    <Controller>
      <template #right>
        <ButtonBasic type="submit" icon-left="check" color="key">
          적용하기
        </ButtonBasic>
      </template>
    </Controller>
  </form>
</article>
</template>

<script setup>
import { reactive } from 'vue';
import store from '../../store';
import { validateForms, getStringJson } from './libs';
import { savePreference } from '../../preference';
import { toast } from '../../modules/toast';
import { printf } from '../../libs/string';
import { err } from '../../libs/error';
import { message } from '../../message';
import { Textarea } from '../../components/forms';
import { Fieldset, Help } from '../../components/forms/fieldset';
import { Controller } from '../../components/navigation';
import ButtonBasic from '../../components/button/basic.vue';

const { navigation } = store.state.preference;
const fields = reactive({
  code: {
    value: getStringJson(navigation),
    error: null,
  },
});

function onSubmit()
{
  try
  {
    validateForms(fields.code.value);
    store.state.preference.navigation = [
      ...(JSON.parse(fields.code.value)),
    ];
    savePreference();
    toast.add(printf(message.success.edit, message.word.preference), 'success');
  }
  catch (e)
  {
    err(['/pages/preference/navigation.vue', 'onSubmit()'], 'error', e.message);
    toast.add(printf(message.fail.edit, message.word.preference), 'error');
  }
}
</script>

<style src="./common.scss" lang="scss" scoped></style>
