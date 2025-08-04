<template>
<form class="post-token" @submit.prevent="onSubmit">
  <header class="post-token__header">
    <h1>공개용 토큰 {{_edit ? '수정하기' : '만들기'}}</h1>
    <p>{{_edit ? '공개 토큰을 수정합니다.' : '새로운 공개 토큰을 만듭니다.'}}</p>
  </header>
  <Fieldset :disabled="state.processing">
    <Field label="프로바이더">
      {{_provider}}
    </Field>
    <Field label="설명" for="post-description">
      <FormInput
        ref="$description"
        v-model="forms.description"
        name="post-description"
        id="post-description"
        placeholder="토큰 설명를 입력해주세요."
        :maxlength="160"
        class="inline"/>
    </Field>
  </Fieldset>
  <blockquote v-if="!_edit" class="guide">
    <h1>토큰 가이드</h1>
    <p>엑세스 토큰을 만든후에 코드를 확인할 수 있습니다.</p>
  </blockquote>
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
import { ref, reactive, computed, onMounted, inject, nextTick } from 'vue'
import { createToken, editToken } from '../../../structure/auth/token.js'
import { authProviderLabel } from '../../../libs/assets.js'
import { pureObject } from '../../../libs/object.js'
import { Fieldset, Field } from '../../forms/fieldset/index.js'
import { FormInput } from '../../forms/index.js'
import { Controller } from '../../navigation/index.js'
import { ButtonBasic } from '../../button/index.js'

const props = defineProps({
  data: Object,
  provider: String,
})
const emits = defineEmits([ 'submit', 'close' ])
const auth = inject('auth')
const error = inject('error')
const errorPath = [ 'components', 'pages', 'auth', 'post-token.vue' ]
const $description = ref()
const state = reactive({
  processing: false,
})
const forms = reactive({
  description: props.data?.description || '',
})

const _edit = computed(() => (!!props.data?.srl))
const _provider = computed(() => {
  return props.data?.provider || authProviderLabel[auth.provider.code]
})

onMounted(async () => {
  await nextTick()
  $description.value.focus()
})

async function onSubmit()
{
  try
  {
    state.processing = true
    if (_edit.value)
    {
      await editToken(props.data.srl, pureObject(forms))
    }
    else
    {
      await createToken(pureObject(forms))
    }
    emits('submit', _edit.value ? 'edit' : 'create')
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onSubmit()' ],
      message: _edit.value ? '토큰을 수정하지 못했습니다.' : '토큰을 만들지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}
</script>

<style src="./post-token.scss" lang="scss" scoped></style>
