<template>
<form ref="root" @submit.prevent="onSubmit">
  <Fieldset class="fields" :disabled="loading">
    <Field label="ID" for="id">
      <FormInput
        v-model="forms.id.value"
        name="id"
        id="id"
        :maxlength="20"
        placeholder="Please input ID"
        :error="!!forms.id.error"
        :required="true"
        class="fields__id"/>
      <Help v-if="!!forms.id.error" color="error">
        {{forms.id.error}}
      </Help>
      <Help v-else>
        Please enter only alphanumeric characters `-` and `_`.
      </Help>
    </Field>
    <Field label="Name" for="name">
      <FormInput
        v-model="forms.name.value"
        name="name"
        id="name"
        :maxlength="50"
        placeholder="Please input app name"
        :error="!!forms.name.error"
        :required="true"
        class="fields__name"/>
    </Field>
    <Field label="Description" for="description">
      <FormInput
        v-model="forms.description.value"
        name="description"
        id="description"
        :maxlength="120"
        placeholder="Please input app description."
        :error="!!forms.description.error"/>
      <Help>
        Description of the app.
      </Help>
    </Field>
  </Fieldset>
  <Controller>
    <template #left>
      <ButtonBasic icon-left="arrow-left" @click="router.back()">
        Back
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic
        type="submit"
        color="key"
        :icon-left="processing ? 'loader' : 'check'"
        :rotate-icon="processing">
        {{isEdit ? 'Edit App' : 'Create App'}}
      </ButtonBasic>
    </template>
  </Controller>
</form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Fieldset, Field, Controller, Help } from '../../forms/fieldset';
import { validateId } from '../../../libs/string';
import { get, post, formData, checkForms } from '../../../libs/api';
import { toast } from '../../../modules/toast';
import { err } from '../../../libs/error';
import FormInput from '../../forms/input.vue';
import ButtonBasic from '../../button/basic.vue';

const router = useRouter();
const props = defineProps({
  srl: Number,
  mode: String,
});
const forms = reactive({
  id: { value: '', error: null },
  name: { value: '', error: null },
  description: { value: '', error: null },
});
const loading = ref(false);
const processing = ref(false);
const isEdit = computed(() => (props.mode === 'edit'));

async function onSubmit()
{
  forms.id.error = null;
  if (!validateId(forms.id.value)) forms.id.error = 'Please check `ID`';

  try
  {
    processing.value = true;
    checkForms(forms);
    const data = formData({
      id: forms.id.value,
      name: forms.name.value,
      description: forms.description.value,
    });
    let res = await post(props.srl ? `/apps/${props.srl}/edit/` : '/apps/', data);
    processing.value = false;
    await router.push('/apps/');
    toast.add(`Success ${props.mode} app.`, 'success');
  }
  catch (e)
  {
    err([ 'components', 'pages', 'apps', 'post.vue', 'onSubmit()' ], 'error', e.message);
    processing.value = false;
    toast.add(`Failed ${props.mode} app.`, 'error');
  }
}

onMounted(async () => {
  if (props.mode !== 'edit') return;
  try
  {
    loading.value = true;
    const res = await get(`/apps/${props.srl}/`);
    forms.id.value = res.data.id;
    forms.name.value = res.data.name;
    forms.description.value = res.data.description;
    loading.value = false;
  }
  catch (e)
  {
    err([ 'components', 'pages', 'apps', 'post.vue', 'onMounted()' ], 'error', e.message);
    loading.value = false;
    toast.add('Failed load data.', 'error');
    await router.replace('/apps/');
  }
});
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
