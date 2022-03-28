<template>
<article>
  <form @submit.prevent="onSubmit">
    <Fieldset>
      <Field :label="$msg('word.language')">
        <Select
          v-model="fields.language.value"
          :placeholder="null"
          :options="[
            { label: '한국어', value: 'ko' },
            { label: 'English', value: 'en' },
          ]"
          style="--select-width: 160px"/>
        <Help>매니저에서 표시되는 언어를 선택합니다.</Help>
      </Field>
      <Field :label="$msg('word.theme')">
        <Select
          v-model="fields.theme.value"
          :placeholder="null"
          :options="[
            { label: $msg('word.system'), value: 'system' },
            { label: $msg('word.light'), value: 'light' },
            { label: $msg('word.dark'), value: 'dark' },
          ]"
          style="--select-width: 160px"/>
        <Help>색상 테마를 변경합니다.</Help>
      </Field>
    </Fieldset>
    <Controller>
      <template #right>
        <ButtonBasic type="submit" icon-left="check" color="key">
          {{$msg('word.apply')}}
        </ButtonBasic>
      </template>
    </Controller>
  </form>
</article>
</template>

<script setup>
import { reactive } from 'vue';
import store from '../../store';
import { savePreference } from '../../store/sub/preference';
import { toast } from '../../modules/toast';
import { printf } from '../../libs/string';
import { $msg } from '../../message';
import { Fieldset, Field, Help } from '../../components/forms/fieldset';
import { Select } from '../../components/forms';
import { Controller } from '../../components/navigation';
import ButtonBasic from '../../components/button/basic.vue';

const { general } = store.state.preference;
const fields = reactive({
  language: {
    value: general.lang,
    error: null,
  },
  theme: {
    value: general.theme,
    error: null,
  },
});

async function onSubmit()
{
  general.lang = fields.language.value;
  general.theme = fields.theme.value;
  await savePreference();
  if (confirm($msg('confirm.reload')))
  {
    location.reload();
  }
  else
  {
    toast.add(printf($msg('success.edit'), $msg('word.preference')), 'success');
  }
}
</script>

<style src="./common.scss" lang="scss" scoped></style>
