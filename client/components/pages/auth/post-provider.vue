<template>
<form class="post-provider" @submit.prevent="onSubmit">
  <header class="post-provider__header">
    <h1>비밀번호 계정 {{_edit ? '수정하기' : '만들기'}}</h1>
    <p>{{_edit ? '계정을 수정합니다.' : '새로운 계정을 만듭니다.'}}</p>
  </header>
  <Loading v-if="state.loading"/>
  <Fieldset v-else-if="state.data || !_edit" :disabled="state.processing">
    <Field label="아이디" for="post-id">
      <FormInput
        v-model="forms.id.value"
        name="post-id"
        id="post-id"
        placeholder="아이디를 입력해주세요."
        :maxlength="30"
        :required="true"
        :error="!!forms.id.error"
        class="inline"
        style="width:200px"/>
      <Help v-if="forms.id.error" color="error">{{forms.id.error}}</Help>
      <Help v-else>"a-z, 0-9, `-`, `_`" 형식으로 입력해주세요.</Help>
    </Field>
    <Field label="이름" for="post-name">
      <FormInput
        v-model="forms.name"
        name="post-name"
        id="post-name"
        placeholder="이름을 입력해주세요."
        :maxlength="30"
        :required="true"
        class="inline"
        style="width:240px"/>
    </Field>
    <Field label="이메일" for="post-email">
      <FormInput
        type="email"
        v-model="forms.email"
        name="post-email"
        id="post-email"
        placeholder="name@domain.com"
        :maxlength="60"
        :required="true"
        class="inline"
        style="width:300px"/>
    </Field>
    <Field label="프로필 이미지" for="post-avatar">
      <FormInput
        type="url"
        v-model="forms.avatar"
        name="post-avatar"
        id="post-avatar"
        :maxlength="255"
        placeholder="https://host/image.jpg"/>
      <Help>프로필 이미지로 사용하는 URL 주소를 입력하세요.</Help>
    </Field>
    <Field label="비밀번호" for="post-password">
      <FormInput
        type="password"
        v-model="forms.password.value"
        name="post-password"
        id="post-password"
        placeholder="비밀번호."
        :maxlength="30"
        :required="!_edit"
        :error="!!forms.password.error"
        class="inline"
        style="width:180px"/>
      <Help v-if="forms.password.error" color="error">{{forms.password.error}}</Help>
      <Help v-else>영문과 숫자를 입력해주세요.</Help>
    </Field>
  </Fieldset>
  <Empty v-else title="no data"/>
  <Controller>
    <template #center>
      <ButtonBasic
        type="button"
        icon-left="x"
        @click="emits('close')">
        닫기
      </ButtonBasic>
      <ButtonBasic
        type="submit"
        :disabled="state.processing"
        :icon-left="state.processing ? 'loader' : (_edit ? 'edit' : 'check')"
        :rotate-icon="state.processing"
        color="key">
        {{state.processing ? '처리중..' : (_edit ? '수정하기' : '만들기')}}
      </ButtonBasic>
    </template>
  </Controller>
</form>
</template>

<script setup>
import { reactive, computed, onMounted, inject } from 'vue'
import { getPasswordItem, create, edit } from '../../../structure/auth/provider.js'
import { pureObject } from '../../../libs/object.js'
import { Loading, Empty } from '../../content/index.js'
import { Fieldset, Field, Help } from '../../forms/fieldset/index.js'
import { FormInput } from '../../forms/index.js'
import { Controller } from '../../navigation/index.js'
import { ButtonBasic } from '../../button/index.js'

const props = defineProps({
  srl: Number,
})
const emits = defineEmits([ 'submit', 'close' ])
const error = inject('error')
const errorPath = [ 'components', 'pages', 'auth', 'post-provider.vue' ]
const state = reactive({
  loading: true,
  processing: false,
  data: null,
})
const forms = reactive({
  id: { value: '', error: '' },
  name: '',
  email: '',
  avatar: '',
  password: { value: '', error: '' },
})

const _edit = computed(() => (!!props.srl))

onMounted(async () => {
  if (!_edit.value)
  {
    state.loading = false
    return
  }
  try
  {
    const res = await getPasswordItem(props.srl)
    if (res?.srl)
    {
      state.data = res
      forms.id.value = res.id || ''
      forms.name = res.name || ''
      forms.email = res.email || ''
      forms.avatar = res.avatar || ''
    }
  }
  catch (e)
  {}
  finally
  {
    state.loading = false
  }
})

async function onSubmit()
{
  try
  {
    forms.id.error = ''
    forms.password.error = ''
    if (forms.id.value && !validateID(forms.id.value))
    {
      forms.id.error = '아이디는 영문 소문자, 숫자, `-`, `_`만 입력할 수 있습니다.'
    }
    if (forms.password.value && !validatePassword(forms.password.value))
    {
      forms.password.error = '비밀번호는 영문과 숫자만 입력할 수 있습니다.'
    }
    state.processing = true
    const data = {
      id: forms.id.value !== state.data?.id ? (forms.id.value || null) : null,
      name: forms.name || null,
      email: forms.email || '',
      avatar: forms.avatar || '',
      password: forms.password.value || null,
    }
    if (_edit.value)
    {
      const _data = pureObject(data)
      await edit(props.srl, _data)
      emits('submit', 'edit', _data)
    }
    else
    {
      await create(pureObject(data))
      emits('submit', 'create')
    }
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onSubmit()' ],
      message: _edit.value ? '계정을 수정하지 못했습니다.' : '계정을 만들지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}

function validateID(id)
{
  const regex = /^[a-z0-9_-]+$/
  return regex.test(id)
}
function validatePassword(password)
{
  const regex = /^[a-zA-Z0-9]+$/
  return regex.test(password)
}
</script>

<style src="./post-provider.scss" lang="scss" scoped></style>
