<template>
<article class="change-password">
  <PageHeader module="users" title="Change user password"/>
  <form ref="root" @submit.prevent="onSubmit">
    <Fieldset class="fields">
      <Field label="번호">{{forms.srl}}</Field>
      <Field label="이메일주소">{{forms.email}}</Field>
      <Field label="비밀번호" for="password">
        <FormInput
          type="password"
          v-model="forms.password.value"
          name="password"
          id="password"
          :maxlength="24"
          placeholder="현재 비밀번호를 입력해주세요."
          :error="!!forms.password.error"
          :required="true"
          class="fields__password"/>
        <Help>사용하고 있는 비밀번호를 입력해주세요.</Help>
      </Field>
      <Field label="새로운 비밀번호" for="password_new">
        <FormInput
          type="password"
          v-model="forms.password_new.value"
          name="password_new"
          id="password_new"
          :maxlength="24"
          placeholder="변경할 비밀번호를 입력해주세요."
          :error="!!forms.password_new.error"
          :required="true"
          class="fields__password"/>
        <Help v-if="forms.password_new.error" color="error">
          {{forms.password_new.error}}
        </Help>
        <Help v-else>새로운 비밀번호를 입력해주세요.</Help>
      </Field>
      <Field label="비밀번호 재입력" for="password_new2">
        <FormInput
          type="password"
          v-model="forms.password_new2.value"
          name="password_new2"
          id="password_new2"
          :maxlength="24"
          placeholder="변경할 비밀번호를 다시 입력해주세요."
          :error="!!forms.password_new2.error"
          :required="true"
          class="fields__password"/>
        <Help v-if="forms.password_new2.error" color="error">
          {{forms.password_new2.error}}
        </Help>
        <Help v-else>새로운 비밀번호와 같은 비밀번호를 입력해주세요.</Help>
      </Field>
    </Fieldset>
    <Controller>
      <template #left>
        <ButtonBasic icon-left="arrow-left" @click="router.back()">
          뒤로가기
        </ButtonBasic>
      </template>
      <template #right>
        <ButtonBasic
          type="submit"
          color="key"
          :icon-left="processing ? 'loader' : 'check'"
          :rotate-icon="processing"
          :disabled="processing">
          비밀번호 변경
        </ButtonBasic>
      </template>
    </Controller>
  </form>
</article>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authStore } from '../../store/auth'
import getData from '../../structure/users/item'
import { post, checkForms, formData } from '../../libs/api'
import { err } from '../../libs/error'
import { toast } from '../../modules/toast'
import PageHeader from '../../components/page/header/index.vue'
import { FormInput } from '../../components/forms'
import { Fieldset, Field, Help } from '../../components/forms/fieldset'
import { Controller } from '../../components/navigation'
import { ButtonBasic } from '../../components/button'

const root = ref()
const router = useRouter()
const route = useRoute()
const auth = authStore()
const forms = reactive({
  srl: '',
  email: '',
  password: { value: '', error: null },
  password_new: { value: '', error: null },
  password_new2: { value: '', error: null },
})
const processing = ref(false)
const loading = ref(false)
const self = computed(() => (auth.user?.srl === Number(route.params.srl)))

async function onSubmit()
{
  forms.password_new.error = null
  forms.password_new2.error = null
  if (forms.password_new.value !== forms.password_new2.value)
  {
    forms.password_new2.error = '새로운 비밀번호와 같은 비밀번호를 입력해주세요.'
    root.value.password_new2.focus()
    return
  }
  if (forms.password.value === forms.password_new.value)
  {
    forms.password_new.error = '현재 비밀번호와 새로운 비밀번호가 같습니다.'
    root.value.password_new.focus()
    return
  }
  try
  {
    processing.value = true
    checkForms(forms)
    await post(`/users/${route.params.srl}/change-password/`, formData({
      password: forms.password.value,
      new_password: forms.password_new.value,
      confirm_password: forms.password_new2.value,
    }))
    processing.value = false
    if (self.value)
    {
      if (!confirm(`비밀번호를 변경했습니다. 정말 로그아웃 할까요?`)) return
      await auth.logout()
    }
    else
    {
      await router.push(`/users/${route.params.srl}/`)
      toast.add('비밀번호를 변경했습니다.', 'success').then()
    }
  }
  catch (e)
  {
    err([ '/pages/users/change-password.vue', 'onSubmit()' ], 'error', e.message)
    processing.value = false
    toast.add('비밀번호를 변경하지 못했습니다.', 'error').then()
  }
}

onMounted(async () => {
  try
  {
    if (!route.params.srl) throw new Error('no srl')
    loading.value = true
    const res = await getData({ url: `/users/${route.params.srl}/` })
    forms.srl = res.srl
    forms.email = res.email
    loading.value = false
  }
  catch (e)
  {
    err([ '/pages/users/change-password.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})
</script>

<style lang="scss" scoped>
.fields {
  &__password {
    --input-width: 360px;
  }
}
</style>
