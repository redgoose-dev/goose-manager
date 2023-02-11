<template>
<article>
  <form @submit.prevent="onSubmit">
    <Fieldset>
      <Field :label="$msg('word.language')">
        <FormSelect
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
        <FormSelect
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

<script lang="ts" setup>
import { reactive, nextTick } from 'vue'
import { preferenceStore } from '../../store/preference'
import { headStore } from '../../store/head'
import { toast } from '../../modules/toast'
import { printf } from '../../libs/string'
import { $msg, changeLanguage } from '../../message'
import { Fieldset, Field, Help } from '../../components/forms/fieldset'
import { FormSelect } from '../../components/forms'
import { Controller } from '../../components/navigation'
import { ButtonBasic } from '../../components/button'

const preference = preferenceStore()
const head = headStore()
const fields = reactive({
  language: {
    value: preference.general.lang,
    error: null,
  },
  theme: {
    value: head.theme,
    error: null,
  },
})

async function onSubmit(): Promise<void>
{
  preference.general.lang = fields.language.value
  head.theme = fields.theme.value
  await preference.save()
  head.updateStorage({ theme: fields.theme.value })
  head.changeTheme()
  await changeLanguage(preference.general.lang)
  head.blink = true
  await nextTick()
  head.blink = false
  toast.add(printf($msg('success.edit'), $msg('word.preference')), 'success')
}
</script>

<style src="./common.scss" lang="scss" scoped></style>
