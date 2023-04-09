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
    value: getStringJson(preference.checklist),
    error: null,
  },
})

async function onSubmit()
{
  try
  {
    validateForms(fields.code.value)
    preference.checklist = {
      ...(JSON.parse(fields.code.value)),
    }
    await preference.save()
    toast.add('환경설정을 수정했습니다.', 'success').then()
  }
  catch (e: any)
  {
    err(['/pages/preference/checklist.vue', 'onSubmit()'], 'error', e.message)
    toast.add('환경설정을 수정하지 못했습니다.', 'error').then()
  }
}
</script>

<style src="./common.scss" lang="scss" scoped></style>
