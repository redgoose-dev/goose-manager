<template>
<form ref="root" @submit.prevent="onSubmit">
  <Fieldset :disabled="loading">
    <Field label="이름" for="name">
      <FormInput
        v-model="forms.name.value"
        name="name"
        id="name"
        :maxlength="40"
        placeholder="분류이름.."
        :error="!!forms.name.error"
        :required="true"
        class="input-name"/>
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
import { get, post, formData, checkForms } from '../../../libs/api'
import { err } from '../../../libs/error'
import { toast } from '../../../modules/toast'
import { Fieldset, Field } from '../../forms/fieldset'
import { Controller } from '../../navigation'
import { FormInput } from '../../forms'
import { ButtonBasic } from '../../button'

const root = ref()
const router = useRouter()
const props = defineProps({
  mode: { type: String, required: true },
  module: { type: String, required: true },
  targetSrl: Number,
  srl: Number,
})
const forms = reactive({
  name: { value: '', error: null },
})
const loading = ref(false)
const processing = ref(false)
const isEdit = computed(() => (props.mode === 'edit'))
const submitLabel = computed(() => {
  switch (props.mode)
  {
    case 'edit':
      return '분류 수정하기'
    case 'create':
    default:
      return '분류 만들기'
  }
})

onMounted(async () => {
  if ( props.mode !== 'edit' ) return
  try
  {
    loading.value = true
    const res = await get(`/categories/${props.srl}/`)
    forms.name.value = res.data.name
    loading.value = false
  }
  catch (e)
  {
    err([ '/components/pages/categories/post.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})

async function onSubmit()
{
  try
  {
    processing.value = true
    checkForms(forms)
    let data = {}
    switch (props.module)
    {
      case 'article':
        data.target_srl = props.targetSrl || 'null'
        break
    }
    await post(isEdit.value ? `/categories/${props.srl}/edit/` : '/categories/', formData({
      module: props.module,
      name: forms.name.value,
      ...data,
    }))
    processing.value = false
    await router.push(isEdit.value ? `../../` : '../')
    const message = (props.mode === 'edit') ? '분류를 수정했습니다.' : '분류를 만들었습니다.'
    toast.add(message, 'success').then()
  }
  catch (e)
  {
    err([ '/components/pages/categories/post.vue', 'onSubmit()' ], 'error', e.message)
    processing.value = false
    const message = (props.mode === 'edit') ? '분류를 수정하지 못했습니다.' : '분류를 만들지 못했습니다.'
    toast.add(message, 'error').then()
  }
}
</script>

<style lang="scss" scoped>
.input-name {
  --input-width: 320px;
}
</style>
