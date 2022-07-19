<template>
<article>
  <header class="section-header">
    <h1 class="section-header__title">Files</h1>
    <p class="section-header__description">
      파일 첨부모듈에 관한 설정입니다.
    </p>
  </header>
  <form class="code-form" @submit.prevent="onSubmit">
    <fieldset class="code-form__fieldset">
      <legend>Files forms</legend>
      <div class="field">
        <FormTextarea
          v-model="fields.code.value"
          placeholder="Please input code"
          :auto-size="false"
          :rows="8"
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

<script lang="ts" setup>
import { reactive } from 'vue'
import { preferenceStore } from '../../store/preference'
import { validateForms, getStringJson } from './libs'
import { toast } from '../../modules/toast'
import { printf } from '../../libs/string'
import { err } from '../../libs/error'
import { $msg } from '../../message'
import { FormTextarea } from '../../components/forms'
import { Help } from '../../components/forms/fieldset'
import { Controller } from '../../components/navigation'
import { ButtonBasic } from '../../components/button'

const preference = preferenceStore()
const fields = reactive({
  code: {
    value: getStringJson(preference.files),
    error: null,
  },
})

async function onSubmit()
{
  try
  {
    validateForms(fields.code.value)
    preference.files = {
      ...(JSON.parse(fields.code.value)),
    }
    await preference.save()
    toast.add(printf($msg('success.edit'), $msg('word.preference')), 'success')
  }
  catch (e: any)
  {
    err(['/pages/preference/files.vue', 'onSubmit()'], 'error', e.message)
    toast.add(printf($msg('fail.edit'), $msg('word.preference')), 'error')
  }
}
</script>

<style src="./common.scss" lang="scss" scoped></style>
