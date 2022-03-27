<template>
<article>
  <header class="section-header">
    <h1 class="section-header__title">Dashboard</h1>
    <p class="section-header__description">
      대시보드에서 사용하는 설정들입니다.
    </p>
  </header>
  <form class="code-form" @submit.prevent="onSubmit">
    <fieldset class="code-form__fieldset">
      <legend>Dashboard forms</legend>
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

const { dashboard } = store.state.preference;
const fields = reactive({
  code: {
    value: getStringJson(dashboard),
    error: null,
  },
});

function onSubmit()
{
  try
  {
    validateForms(fields.code.value);
    store.state.preference.dashboard = {
      ...(JSON.parse(fields.code.value)),
    };
    savePreference();
    toast.add(printf(message.success.edit, message.word.preference), 'success');
  }
  catch (e)
  {
    err(['/pages/preference/dashboard.vue', 'onSubmit()'], 'error', e.message);
    toast.add(printf(message.fail.edit, message.word.preference), 'error');
  }
}
</script>

<style src="./common.scss" lang="scss" scoped></style>
