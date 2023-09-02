<template>
<form ref="root" @submit.prevent="onSubmit">
  <Fieldset class="fields" :disabled="loading">
    <Field label="아이디" for="id">
      <FormInput
        v-model="forms.id.value"
        name="id"
        id="id"
        :maxlength="20"
        placeholder="아이디를 입력해주세요."
        :error="!!forms.id.error"
        :required="true"
        class="fields__id"/>
      <Help v-if="!!forms.id.error" color="error">
        {{forms.id.error}}
      </Help>
      <Help v-else>
        "알파벳과 숫자형식의 글자, `-` and `_`"형식으로 입력해주세요.
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
        :icon-left="processing ? 'loader' : 'check'"
        :rotate-icon="processing">
        {{submitLabel}}
      </ButtonBasic>
    </template>
  </Controller>
</form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { validateId, printf } from '../../../libs/string'
import { get, post, formData, checkForms } from '../../../libs/api'
import { toast } from '../../../modules/toast'
import { err } from '../../../libs/error'
import { Fieldset, Field, Help } from '../../forms/fieldset'
import { Controller } from '../../navigation'
import { FormInput } from '../../forms'
import { ButtonBasic } from '../../button'

const router = useRouter()
const props = defineProps({
  mode: { type: String, required: true },
  srl: Number,
})
const forms = reactive({
  id: { value: '', error: null },
  name: { value: '', error: null },
  description: { value: '', error: null },
})
const loading = ref(false)
const processing = ref(false)
const submitLabel = computed(() => {
  return (props.mode === 'edit') ? '앱 수정하기' : '앱 만들기'
})

onMounted(async () => {
  if (props.mode !== 'edit') return
  try
  {
    loading.value = true
    const res = await get(`/apps/${props.srl}/`)
    forms.id.value = res.data?.id
    forms.name.value = res.data?.name
    forms.description.value = res.data?.description
    loading.value = false
  }
  catch (e)
  {
    err([ '/components/pages/apps/post.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})

async function onSubmit()
{
  forms.id.error = null
  if (!validateId(forms.id.value)) forms.id.error = '아이디를 확인해주세요.'
  try
  {
    processing.value = true
    checkForms(forms)
    const data = formData({
      id: forms.id.value,
      name: forms.name.value,
      description: forms.description.value,
    })
    await post(props.srl ? `/apps/${props.srl}/edit/` : '/apps/', data)
    processing.value = false
    await router.push('/apps/')
    switch (props.mode) {
      case 'create':
        toast.add('앱을 만들었습니다.', 'success').then()
        break
      case 'edit':
        toast.add('앱을 수정했습니다.', 'success').then()
        break
    }
  }
  catch (e)
  {
    err([ '/components/pages/apps/post.vue', 'onSubmit()' ], 'error', e.message)
    processing.value = false
    switch (props.mode) {
      case 'create':
        toast.add('앱을 만들지 못했습니다.', 'error').then()
        break
      case 'edit':
        toast.add('앱을 수정하지 못했습니다.', 'error').then()
        break
    }
  }
}
</script>

<style lang="scss" scoped>
.fields {
  &__id {
    --input-width: 240px;
  }
  &__name {
    --input-width: 320px;
  }
}
</style>
