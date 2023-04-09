<template>
<article>
  <form @submit.prevent="onSubmit">
    <Fieldset>
      <Field label="테마">
        <FormSelect
          v-model="fields.theme.value"
          :placeholder="null"
          :options="[
            { label: '시스템', value: 'system' },
            { label: '라이트', value: 'light' },
            { label: '다크', value: 'dark' },
          ]"
          style="--select-width: 160px"/>
        <Help>색상 테마를 변경합니다.</Help>
      </Field>
    </Fieldset>
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
import { reactive, nextTick } from 'vue'
import { preferenceStore } from '../../store/preference'
import { headStore } from '../../store/head'
import { toast } from '../../modules/toast'
import { err } from '../../libs/error'
import { Fieldset, Field, Help } from '../../components/forms/fieldset'
import { FormSelect } from '../../components/forms'
import { Controller } from '../../components/navigation'
import { ButtonBasic } from '../../components/button'

const preference = preferenceStore()
const head = headStore()
const fields = reactive({
  theme: {
    value: head.theme,
    error: null,
  },
})

async function onSubmit(): Promise<void>
{
  try
  {
    head.theme = fields.theme.value
    await preference.save()
    head.updateStorage({ theme: fields.theme.value })
    head.changeTheme()
    head.blink = true
    await nextTick()
    head.blink = false
    toast.add('환경설정을 수정했습니다.', 'success').then()
  }
  catch (e: any)
  {
    err(['/pages/preference/general.vue', 'onSubmit()'], 'error', e.message)
    toast.add('환경설정을 수정하지 못했습니다.', 'error').then()
  }
}
</script>

<style src="./common.scss" lang="scss" scoped></style>
