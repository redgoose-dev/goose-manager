<template>
<form ref="root" @submit.prevent="onSubmit">
  <Fieldset class="fields" :disabled="loading">
    <Field label="E-Mail" for="email">
      <Input
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
    <Field label="Name" for="name">
      <Input
        v-model="forms.name.value"
        name="name"
        id="name"
        :maxlength="30"
        placeholder="Nick kornel"
        :error="!!forms.name.error"
        :required="true"
        class="fields__name"/>
    </Field>
    <Field v-if="!isEdit" label="Password" for="password">
      <Input
        type="password"
        v-model="forms.password.value"
        name="password"
        id="password"
        :maxlength="24"
        placeholder="Please input password."
        :error="!!forms.password.error"
        :required="true"
        class="fields__password"/>
    </Field>
    <Field v-if="!isEdit" label="Confirm password" for="password2">
      <Input
        type="password"
        v-model="forms.password2.value"
        name="password2"
        id="password2"
        :maxlength="24"
        placeholder="Please enter the same password."
        :error="!!forms.password2.error"
        :required="true"
        class="fields__password"/>
      <Help v-if="!!forms.password2.error" color="error">
        {{forms.password2.error}}
      </Help>
    </Field>
    <FieldCheck label="Admin" description="관리자 권한으로 사용합니다." for="admin">
      <Switch v-model="forms.admin.value" :disabled="!useAdminField"/>
    </FieldCheck>
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
        {{isEdit ? 'Edit User' : 'Create User'}}
      </ButtonBasic>
    </template>
  </Controller>
</form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import store from '../../../store';
import { get, post, formData, checkForms } from '../../../libs/api';
import { err } from '../../../libs/error';
import { message } from '../../../message';
import { printf } from '../../../libs/string';
import { toast } from '../../../modules/toast';
import { Fieldset, Field, FieldCheck, Help } from '../../forms/fieldset';
import { Controller } from '../../navigation';
import { Input, Switch } from '../../forms';
import ButtonBasic from '../../button/basic.vue';

const root = ref();
const router = useRouter();
const props = defineProps({
  mode: { type: String, required: true },
  srl: Number,
});
const forms = reactive({
  email: { value: '', error: null },
  name: { value: '', error: null },
  password: { value: '', error: null },
  password2: { value: '', error: null },
  admin: { value: false, error: null },
});
const loading = ref(false);
const processing = ref(false);
const useAdminField = computed(() => {
  if (props.mode === 'create')
  {
    return store.state.user.admin;
  }
  else
  {
    return store.state.user.srl !== Number(props.srl);
  }
});
const isEdit = computed(() => (props.mode === 'edit'));

async function onSubmit()
{
  // check password
  if (props.mode === 'create')
  {
    forms.password2.error = null;
    if (forms.password.value !== forms.password2.value)
    {
      forms.password2.error = message.error.samePassword;
      root.value.password2.focus();
    }
  }

  try
  {
    processing.value = true;
    checkForms(forms);
    const data = formData(isEdit.value ? {
      name: forms.name.value,
      admin: !!forms.admin.value ? 1 : 0,
    } : {
      email: forms.email.value,
      name: forms.name.value,
      password: forms.password.value,
      password2: forms.password2.value,
      admin: !!forms.admin.value ? 1 : 0,
    });
    let url = props.srl ? `/users/${props.srl}/edit/` : '/users/';
    let res = await post(url, data);
    processing.value = false;
    const srl = res.srl || props.srl || null;
    await router.push(srl ? `/users/${srl}/` : '/users/');
    toast.add(printf(message.success[props.mode], message.word.user), 'success');
  }
  catch (e)
  {
    err([ 'components', 'pages', 'users', 'post.vue', 'onSubmit()' ], 'error', e.message);
    processing.value = false;
    toast.add(printf(message.fail[props.mode], message.word.user), 'error');
  }
}

onMounted(async () => {
  if (props.mode !== 'edit') return;
  try
  {
    loading.value = true;
    const res = await get(`/users/${props.srl}/`);
    forms.email.value = res.data.email;
    forms.name.value = res.data.name;
    forms.admin.value = res.data.admin > 0;
    loading.value = false;
  }
  catch (e)
  {
    err([ 'components', 'pages', 'users', 'post.vue', 'onMounted()' ], 'error', e.message);
    throw e.message;
  }
});
</script>

<style lang="scss" scoped>
.fields {
  &__email {
    --input-width: 400px;
  }
  &__name {
    --input-width: 200px;
  }
  &__password {
    --input-width: 300px;
  }
}
</style>
