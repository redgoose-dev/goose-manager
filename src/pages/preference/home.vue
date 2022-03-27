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
          ]"/>
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
import { savePreference } from '../../preference';
import { toast } from '../../modules/toast';
import { printf } from '../../libs/string';
import { $msg } from '../../message';
import { Fieldset, Field } from '../../components/forms/fieldset';
import { Select } from '../../components/forms';
import { Controller } from '../../components/navigation';
import ButtonBasic from '../../components/button/basic.vue';

const fields = reactive({
  language: {
    value: store.state.preference.lang,
    error: null,
  },
});

function onSubmit()
{
  store.state.preference.lang = fields.language.value;
  savePreference();
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
