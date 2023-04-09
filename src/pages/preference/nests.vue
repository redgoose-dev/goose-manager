<template>
<article>
  <header class="section-header">
    <h1 class="section-header__title">Nests</h1>
    <p class="section-header__description">
      둥지모듈에 관한 설정들입니다.
    </p>
  </header>
  <form class="code-form" @submit.prevent="onSubmit">
    <fieldset class="code-form__fieldset">
      <legend>Nests forms</legend>
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
import { err } from '../../libs/error'
import { FormTextarea } from '../../components/forms'
import { Help } from '../../components/forms/fieldset'
import { Controller } from '../../components/navigation'
import { ButtonBasic } from '../../components/button'

const preference = preferenceStore()
const fields = reactive({
  code: {
    value: getStringJson(preference.nests),
    error: null,
  },
})

async function onSubmit()
{
  try
  {
    validateForms(fields.code.value)
    preference.nests = {
      ...(JSON.parse(fields.code.value)),
    }
    await preference.save()
    toast.add('환경설정을 수정했습니다.', 'success').then()
  }
  catch (e: any)
  {
    err(['/pages/preference/nests.vue', 'onSubmit()'], 'error', e.message)
    toast.add('환경설정을 수정하지 못했습니다.', 'error').then()
  }
}
</script>

<style src="./common.scss" lang="scss" scoped></style>
