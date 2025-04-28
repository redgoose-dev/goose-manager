<template>
<form ref="root" @submit.prevent="onSubmit">
  <Fieldset class="fields" :disabled="loading">
    <Field label="이메일 주소" for="email">
      <FormInput
        type="email"
        v-model="forms.email.value"
        name="email"
        id="email"
        :maxlength="40"
        placeholder="nick@redgoose.me"
        :error="!!forms.email.error"
        :required="true"
        :readonly="isEdit"
        class="fields__email"/>
      <Help v-if="isEdit">
        이메일 주소는 수정할 수 없습니다.
      </Help>
    </Field>
    <Field label="이름" for="name">
      <FormInput
        v-model="forms.name.value"
        name="name"
        id="name"
        :maxlength="30"
        placeholder="Nick kornel"
        :error="!!forms.name.error"
        :required="true"
        class="fields__name"/>
    </Field>
    <Field v-if="!isEdit" label="비밀번호" for="password">
      <FormInput
        type="password"
        v-model="forms.password.value"
        name="password"
        id="password"
        :maxlength="24"
        placeholder="비밀번호를 입력해주세요."
        :error="!!forms.password.error"
        :required="true"
        class="fields__password"/>
    </Field>
    <Field v-if="!isEdit" label="비밀번호 확인" for="password2">
      <FormInput
        type="password"
        v-model="forms.password2.value"
        name="password2"
        id="password2"
        :maxlength="24"
        placeholder="같은 비밀번호를 입력해주세요."
        :error="!!forms.password2.error"
        :required="true"
        class="fields__password"/>
      <Help v-if="!!forms.password2.error" color="error">
        {{forms.password2.error}}
      </Help>
    </Field>
    <FieldCheck label="관리자" description="관리자 권한으로 사용합니다." for="admin">
      <FormSwitch v-model="forms.admin.value" :disabled="!useAdminField"/>
    </FieldCheck>
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
        :rotate-icon="processing">
        {{isEdit ? '사용자 수정' : '사용자 추가'}}
      </ButtonBasic>
    </template>
  </Controller>
</form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../../../store/auth'
import { get, post, formData, checkForms } from '../../../libs/api'
import { err } from '../../../libs/error'
import { toast } from '../../../modules/toast'
import { Fieldset, Field, FieldCheck, Help } from '../../forms/fieldset'
import { Controller } from '../../navigation'
import { FormInput, FormSwitch } from '../../forms'
import { ButtonBasic } from '../../button'

const router = useRouter()
const props = defineProps({
  mode: { type: String, required: true },
  srl: Number,
})
const auth = authStore()
const root = ref()
const forms = reactive({
  email: { value: '', error: null },
  name: { value: '', error: null },
  password: { value: '', error: null },
  password2: { value: '', error: null },
  admin: { value: false, error: null },
})
const loading = ref(false)
const processing = ref(false)
const useAdminField = computed(() => {
  if (props.mode === 'create')
  {
    return Boolean(auth.user?.admin)
  }
  else
  {
    return auth.user?.srl !== Number(props.srl)
  }
})
const isEdit = computed(() => (props.mode === 'edit'))

async function onSubmit()
{
  if (props.mode === 'create')
  {
    forms.password2.error = null
    if (forms.password.value !== forms.password2.value)
    {
      forms.password2.error = '확인용 비밀번호가 다릅니다.'
      root.value.password2.focus()
    }
  }
  try
  {
    processing.value = true
    checkForms(forms)
    const data = formData(isEdit.value ? {
      name: forms.name.value,
      admin: !!forms.admin.value ? 1 : 0,
    } : {
      email: forms.email.value,
      name: forms.name.value,
      password: forms.password.value,
      password2: forms.password2.value,
      admin: !!forms.admin.value ? 1 : 0,
    })
    const url = props.srl ? `/users/${props.srl}/edit/` : '/users/'
    const res = await post(url, data)
    processing.value = false
    const srl = res.srl || props.srl || NaN
    await router.push(srl ? `/users/${String(srl)}/` : '/users/')
    switch (props.mode) {
      case 'create':
        toast.add('사용자를 만들었습니다.', 'success').then()
        break
      case 'edit':
        toast.add('사용자를 수정했습니다.', 'success').then()
        break
    }
  }
  catch (e)
  {
    err([ '/components/pages/users/post.vue', 'onSubmit()' ], 'error', e.message)
    processing.value = false
    switch (props.mode) {
      case 'create':
        toast.add('사용자를 만들지 못했습니다.', 'error').then()
        break
      case 'edit':
        toast.add('사용자를 수정하지 못했습니다.', 'error').then()
        break
    }
  }
}

onMounted(async () => {
  if (props.mode !== 'edit') return
  try
  {
    loading.value = true
    const res = await get(`/users/${props.srl}/`)
    forms.email.value = res.data.email
    forms.name.value = res.data.name
    forms.admin.value = res.data.admin > 0
    loading.value = false
  }
  catch (e)
  {
    err([ '/components/pages/users/post.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})
</script>

<style src="./post.scss" lang="scss" scoped></style>
