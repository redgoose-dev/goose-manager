<template>
<form ref="root" @submit.prevent="onSubmit">
  <Fieldset :disabled="state.loading" class="fields">
    <Field label="코드" for="code">
      <FormInput
        v-model="forms.code.value"
        name="code"
        id="code"
        :maxlength="24"
        placeholder="코드를 입력해주세요."
        :required="true"
        class="fields__code"/>
      <Help>
        {{forms.code.error || '"알파벳, 숫자형식의 글자와 `-`, `_`" 형식으로 입력해주세요.'}}
      </Help>
    </Field>
    <Field label="이름" for="name">
      <FormInput
        v-model="forms.name.value"
        name="name"
        id="name"
        :maxlength="50"
        placeholder="이름을 입력해주세요."
        :error="!!forms.name.error"
        :required="true"
        class="fields__name"/>
      <Help>앱의 이름입니다.</Help>
    </Field>
    <Field label="설명" for="description">
      <FormInput
        v-model="forms.description.value"
        name="description"
        id="description"
        :maxlength="120"
        placeholder="설명을 입력해주세요."
        :error="!!forms.description.error"/>
      <Help>앱의 설명입니다.</Help>
    </Field>
  </Fieldset>
  <Controller>
    <template #left>
      <ButtonBasic type="button" icon-left="arrow-left" @click="router.back()">
        뒤로가기
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic
        type="submit"
        color="key"
        :icon-left="state.processing ? 'loader' : 'check'"
        :rotate-icon="state.processing">
        {{_submitLabel}}
      </ButtonBasic>
    </template>
  </Controller>
</form>
</template>

<script setup>
import { reactive, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { validateCode } from '../../../libs/strings.js'
import { request, checkForms, formData } from '../../../libs/api.js'
import { Fieldset, Field, Help } from '../../forms/fieldset/index.js'
import { FormInput } from '../../forms/index.js'
import { Controller } from '../../navigation/index.js'
import { ButtonBasic } from '../../button/index.js'

const toast = inject('toast')
const error = inject('error')
const router = useRouter()
const props = defineProps({
  mode: { type: String, required: true },
  srl: Number,
})
const forms = reactive({
  code: { value: '', error: null },
  name: { value: '', error: null },
  description: { value: '', error: null },
})
const state = reactive({
  loading: true,
  processing: false,
})
const errorPath = [ 'components', 'pages', 'app', 'post.vue' ]

const _isEdit = computed(() => (props.mode === 'edit'))
const _submitLabel = computed(() => {
  return _isEdit.value ? '앱 수정하기' : '앱 만들기'
})

onMounted(async () => {
  try
  {
    if (!_isEdit.value) throw undefined
    state.loading = true
    const { data } = await request(`/app/${props.srl}/`)
    if (!data) throw new Error('데이터가 없습니다.')
    forms.code.value = data.code
    forms.name.value = data.name
    forms.description.value = data.description
  }
  catch (e)
  {
    if (e)
    {
      error.catch({
        path: [ ...errorPath, 'onMounted' ],
        message: '데이터를 가져오지 못했습니다.',
        error: e,
      })
    }
  }
  finally
  {
    state.loading = false
  }
})

async function onSubmit()
{
  forms.code.error = null
  if (!validateCode(forms.code.value))
  {
    forms.code.error = '코드를 확인해주세요.'
    return
  }
  try
  {
    state.processing = true
    checkForms(forms)
    const data = {
      code: forms.code.value,
      name: forms.name.value,
      description: forms.description.value,
    }
    const url = props.srl ? `/app/${props.srl}/` : '/app/'
    await request(url, {
      method: props.srl ? 'patch' : 'put',
      body: formData(data),
    })
    const message = _isEdit.value ? '앱을 수정했습니다.' : '앱을 만들었습니다.'
    toast.add(message, 'success').then()
    await router.push('/app/')
  }
  catch (e)
  {
    const message = _isEdit.value ? '앱을 수정하지 못했습니다.' : '앱을 만들지 못했습니다.'
    error.catch({
      path: [ ...errorPath, 'onSubmit()' ],
      message,
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}
</script>

<style lang="scss" scoped>
.fields {
  &__code {
    --input-width: 240px;
  }
  &__name {
    --input-width: 360px;
  }
}
</style>
