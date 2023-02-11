<template>
<form ref="root" @submit.prevent="onSubmit">
  <Fieldset class="fields" :disabled="loading">
    <Field :label="message.word.id" for="id">
      <FormInput
        v-model="forms.id.value"
        name="id"
        id="id"
        :maxlength="20"
        :placeholder="printf(message.words.pleaseInput, 'ID')"
        :error="!!forms.id.error"
        :required="true"
        class="fields__id"/>
      <Help v-if="!!forms.id.error" color="error">
        {{forms.id.error}}
      </Help>
      <Help v-else>
        {{printf(message.words.pleaseInputOnly, `"${message.word.alphanumeric}, \`-\` and \`_\`"`)}}
      </Help>
    </Field>
    <Field :label="message.word.name" for="name">
      <FormInput
        v-model="forms.name.value"
        name="name"
        id="name"
        :maxlength="50"
        :placeholder="printf(message.words.pleaseInput, message.word.name)"
        :error="!!forms.name.error"
        :required="true"
        class="fields__name"/>
    </Field>
    <Field :label="message.word.description" for="description">
      <FormInput
        v-model="forms.description.value"
        name="description"
        id="description"
        :maxlength="120"
        :placeholder="printf(message.words.pleaseInput, message.word.description)"
        :error="!!forms.description.error"/>
      <Help>{{printf(message.words.descriptionOf, message.word.app)}}</Help>
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
        {{submitLabel}}
      </ButtonBasic>
    </template>
  </Controller>
</form>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { validateId, printf } from '../../../libs/string'
import { get, post, formData, checkForms } from '../../../libs/api'
import { toast } from '../../../modules/toast'
import { err } from '../../../libs/error'
import { message } from '../../../message'
import { Fieldset, Field, Help } from '../../forms/fieldset'
import { Controller } from '../../navigation'
import { FormInput } from '../../forms'
import { ButtonBasic } from '../../button'

interface Forms {
  id: { value: string, error: any }
  name: { value: string, error: any }
  description: { value: string, error: any }
}

const router = useRouter()
const props = defineProps<{
  mode: string
  srl?: number
}>()
const forms = reactive<Forms>({
  id: { value: '', error: null },
  name: { value: '', error: null },
  description: { value: '', error: null },
})
const loading = ref<boolean>(false)
const processing = ref<boolean>(false)
const submitLabel = computed<string>(() => {
  if (props.mode === 'edit')
  {
    return printf(message.word.isEdit, message.word.app)
  }
  else
  {
    return printf(message.word.isCreate, message.word.app)
  }
})

onMounted(async (): Promise<void> => {
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
  catch (e: any)
  {
    err([ '/components/pages/apps/post.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})

async function onSubmit(): Promise<void>
{
  forms.id.error = null
  if (!validateId(forms.id.value)) forms.id.error = printf(message.words.pleaseCheck, 'ID')
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
    toast.add(printf(message.success[props.mode], message.word.app), 'success').then()
  }
  catch (e: any)
  {
    err([ '/components/pages/apps/post.vue', 'onSubmit()' ], 'error', e.message)
    processing.value = false
    toast.add(printf(message.fail[props.mode], message.word.app), 'error').then()
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
