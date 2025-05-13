<template>
<form class="login-form" @submit.prevent="onSubmit">
  <fieldset>
    <legend>로그인 필드</legend>
    <div class="field field--id">
      <p class="field__label">
        <label for="email">이메일 주소</label>
      </p>
      <div class="field__body">
        <FormInput
          type="email"
          name="email"
          id="email"
          v-model="forms.email"
          :maxlength="30"
          placeholder="이메일 주소를 입력해주세요."
          autocomplete="email"
          :required="true"/>
      </div>
    </div>
    <div class="field field--password">
      <p class="field__label">
        <label for="password">비밀번호</label>
      </p>
      <div class="field__body">
        <FormInput
          type="password"
          name="password"
          id="password"
          v-model="forms.password"
          :maxlength="30"
          placeholder="비밀번호를 입력해주세요."
          :required="true"/>
      </div>
    </div>
    <div class="field field--save">
      <p class="save-auth">
        <FormCheckbox
          name="save-auth"
          id="save-auth"
          v-model="forms.save"
          size="small"/>
        <label for="save-auth">로그인정보 저장하기</label>
      </p>
    </div>
  </fieldset>
  <nav class="submit">
    <ButtonBasic
      type="submit"
      :color="processing ? '' : 'key'"
      :rotate-icon="processing"
      :disabled="processing"
      :icon-left="processing ? 'loader' : 'power'">
      로그인
    </ButtonBasic>
  </nav>
</form>
</template>

<script setup>
import { reactive, ref, inject } from 'vue'
import { authStore } from '../../../store/auth.js'
import { ButtonBasic } from '../../button/index.js'
import { FormCheckbox, FormInput } from '../../forms/index.js'

const toast = inject('toast')
const auth = authStore()
const processing = ref(false)
const forms = reactive({
  email: '',
  password: '',
  save: false,
})

async function onSubmit()
{
  try
  {
    processing.value = true
    const res = await auth.login(forms.email, forms.password, forms.save)
    // console.log('onSubmit()', res)
  }
  catch(e)
  {
    toast.add('Error login', 'error').then()
    console.error(e)
  }
  finally
  {
    processing.value = false
  }
}
</script>

<style src="./login-form.scss" lang="scss" scoped></style>
