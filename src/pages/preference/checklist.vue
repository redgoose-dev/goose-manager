<template>
<article>
  <header class="section-header">
    <h1 class="section-header__title">Checklist</h1>
    <p class="section-header__description">
      체크리스트 모듈에 관한 설정 데이터입니다.
    </p>
  </header>
  <form class="code-form" @submit.prevent="onSubmit">
    <fieldset class="code-form__fieldset">
      <legend>Checklist forms</legend>
      <div class="field">
        <FormTextarea
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
import { savePreference } from '../../store/sub/preference';
import { toast } from '../../modules/toast';
import { printf } from '../../libs/string';
import { err } from '../../libs/error';
import { $msg } from '../../message';
import { FormTextarea } from '../../components/forms';
import { Help } from '../../components/forms/fieldset';
import { Controller } from '../../components/navigation';
import ButtonBasic from '../../components/button/basic.vue';

const { checklist } = store.state.preference;
const fields = reactive({
  code: {
    value: getStringJson(checklist),
    error: null,
  },
});

async function onSubmit()
{
  try
  {
    validateForms(fields.code.value);
    store.state.preference.checklist = {
      ...(JSON.parse(fields.code.value)),
    };
    await savePreference();
    toast.add(printf($msg('success.edit'), $msg('word.preference')), 'success');
  }
  catch (e)
  {
    err(['/pages/preference/checklist.vue', 'onSubmit()'], 'error', e.message);
    toast.add(printf($msg('fail.edit'), $msg('word.preference')), 'error');
  }
}
</script>

<style src="./common.scss" lang="scss" scoped></style>
