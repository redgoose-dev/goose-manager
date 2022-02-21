<template>
<form ref="root" @submit.prevent="onSubmit">
  <Fieldset class="fields" :disabled="loading">
    <Field label="Name" for="name">
      <FormInput
        v-model="forms.name.value"
        name="name"
        id="name"
        :maxlength="50"
        placeholder="goose's navigation"
        :error="!!forms.name.error"
        :required="true"
        class="fields__name"/>
    </Field>
    <Field label="Description" for="description">
      <FormInput
        v-model="forms.description.value"
        name="description"
        id="description"
        :maxlength="150"
        placeholder="note comment.."
        :error="!!forms.name.error"
        class="fields__description"/>
    </Field>
    <Field label="JSON" for="json">
      <FormTextarea
        v-model="forms.json.value"
        name="json"
        id="json"
        :placeholder='`{ "foo": "bar" }`'
        :rows="15"
        :error="!!forms.json.error"
        :required="true"
        @submit="onSubmit"/>
      <Help v-if="!!forms.json.error" color="error">
        {{forms.json.error}}
      </Help>
    </Field>
  </Fieldset>
  <Controller>
    <template #left>
      <ButtonBasic icon-left="arrow-left" @click="router.back()">Back</ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic
        type="submit"
        color="key"
        :icon-left="processing ? 'loader' : 'check'"
        :rotate-icon="processing">
        {{isEdit ? 'Edit JSON' : 'Create JSON'}}
      </ButtonBasic>
    </template>
  </Controller>
</form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { get, post, formData, checkForms } from '../../../libs/api';
import { err } from '../../../libs/error';
import { printf } from '../../../libs/string';
import { message } from '../../../message';
import { toast } from '../../../modules/toast';
import { Fieldset, Field, Controller, Help } from '../../forms/fieldset';
import FormInput from '../../forms/input.vue';
import FormTextarea from '../../forms/textarea.vue';
import ButtonBasic from '../../button/basic.vue';

const root = ref();
const router = useRouter();
const props = defineProps({
  mode: { type: String, required: true },
  srl: Number,
});
const forms = reactive({
  name: { value: '', error: null },
  description: { value: '', error: null },
  json: { value: '', error: null },
});
const loading = ref(false);
const processing = ref(false);
const isEdit = computed(() => (props.mode === 'edit'));

function validateForms()
{
  forms.json.error = null;
  // check json data
  try
  {
    JSON.parse(forms.json.value);
  }
  catch (e)
  {
    forms.json.error = message.error.parsingJSON;
  }
}

function getStringJson(src)
{
  try
  {
    return JSON.stringify(src, null, 2);
  }
  catch (e)
  {
    return '{}';
  }
}

async function onSubmit()
{
  try
  {
    processing.value = true;
    validateForms();
    checkForms(forms);
    const data = formData({
      name: forms.name.value,
      description: forms.description.value,
      json: forms.json.value,
    });
    let url = props.mode === 'edit' ? `/json/${props.srl}/edit/` : '/json/';
    let res = await post(url, data);
    processing.value = false;
    const srl = res.srl || props.srl || null;
    await router.push(srl ? `/json/${srl}/` : '/json/');
    toast.add(printf(message.success[props.mode], 'JSON'), 'success');
  }
  catch (e)
  {
    err([ 'components', 'pages', 'json', 'post.vue', 'onSubmit()' ], 'error', e.message);
    processing.value = false;
    toast.add(printf(message.fail[props.mode], 'JSON'), 'error');
  }
}

onMounted(async () => {
  if (props.mode !== 'edit') return;
  try
  {
    loading.value = true;
    const res = await get(`/json/${props.srl}/`);
    forms.name.value = res.data.name;
    forms.description.value = res.data.description;
    forms.json.value = getStringJson(res.data.json);
    loading.value = false;
  }
  catch (e)
  {
    err([ 'components', 'pages', 'json', 'post.vue', 'onMounted()' ], 'error', e.message);
    loading.value = false;
    throw new Error(e.message);
  }
});
</script>

<style lang="scss" scoped>
.fields {
  &__name {
    --input-width: 320px;
  }
}
</style>
