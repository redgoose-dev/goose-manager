<template>
<form ref="root" @submit.prevent="onSubmit">
  <Fieldset :disabled="loading">
    <Field label="Name" for="name">
      <FormInput
        v-model="forms.name.value"
        name="name"
        id="name"
        :maxlength="40"
        placeholder="Please type name"
        :error="!!forms.name.error"
        :required="true"
        class="input-name"/>
    </Field>
  </Fieldset>
  <Controller>
    <template #left>
      <ButtonBasic type="button" icon-left="arrow-left" @click="router.back()">
        {{message.word.back}}
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic
        type="submit"
        color="key"
        :icon-left="processing ? 'loader' : 'check'"
        :rotate-icon="processing">
        {{isEdit ? 'Edit category' : 'Create category'}}
      </ButtonBasic>
    </template>
  </Controller>
</form>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get, post, formData, checkForms } from '../../../libs/api'
import { err } from '../../../libs/error'
import { printf } from '../../../libs/string'
import { message } from '../../../message'
import { toast } from '../../../modules/toast'
import { Fieldset, Field } from '../../forms/fieldset'
import { Controller } from '../../navigation'
import { FormInput } from '../../forms'
import { ButtonBasic } from '../../button'

interface Props {
  mode: string
  module: 'article'|'json'
  targetSrl?: number
  srl?: number
}

const root = ref()
const router = useRouter()
const props = defineProps<Props>()
const forms = reactive<any>({
  name: { value: '', error: null },
})
const loading = ref<boolean>(false)
const processing = ref<boolean>(false)
const isEdit = computed<boolean>(() => (props.mode === 'edit'))

async function onSubmit():Promise<void>
{
  try
  {
    processing.value = true
    checkForms(forms)
    let data: any = {}
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
    toast.add(printf(message.success[props.mode], 'category'), 'success').then()
  }
  catch (e: any)
  {
    err([ '/components/pages/categories/post.vue', 'onSubmit()' ], 'error', e.message)
    processing.value = false
    toast.add(printf(message.fail[props.mode], 'categories'), 'error').then()
  }
}

onMounted(async () => {
  if ( props.mode !== 'edit' ) return
  try
  {
    loading.value = true
    const res = await get(`/categories/${props.srl}/`)
    forms.name.value = res.data.name
    loading.value = false
  }
  catch (e: any)
  {
    err([ '/components/pages/categories/post.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})
</script>

<style lang="scss" scoped>
.input-name {
  --input-width: 320px;
}
</style>
