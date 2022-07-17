<template>
<article>
  <PageHeader module="users" title="Change user password"/>
  <form ref="root" @submit.prevent="onSubmit">
    <Fieldset class="fields">
      <Field label="srl">{{forms.srl}}</Field>
      <Field label="Email">{{forms.email}}</Field>
      <Field label="Password" for="password">
        <FormInput
          type="password"
          v-model="forms.password.value"
          name="password"
          id="password"
          :maxlength="24"
          placeholder="Current password"
          :error="!!forms.password.error"
          :required="true"
          class="fields__password"/>
        <Help>{{message.words.guideCurrentPassword}}</Help>
      </Field>
      <Field label="New password" for="password_new">
        <FormInput
          type="password"
          v-model="forms.password_new.value"
          name="password_new"
          id="password_new"
          :maxlength="24"
          placeholder="New password"
          :error="!!forms.password_new.error"
          :required="true"
          class="fields__password"/>
        <Help v-if="forms.password_new.error" color="error">
          {{forms.password_new.error}}
        </Help>
        <Help v-else>{{message.words.guideNewPassword}}</Help>
      </Field>
      <Field label="Confirm password" for="password_new2">
        <FormInput
          type="password"
          v-model="forms.password_new2.value"
          name="password_new2"
          id="password_new2"
          :maxlength="24"
          placeholder="Retype new password"
          :error="!!forms.password_new2.error"
          :required="true"
          class="fields__password"/>
        <Help v-if="forms.password_new2.error" color="error">
          {{forms.password_new2.error}}
        </Help>
        <Help v-else>{{message.words.guideVerifyPassword}}</Help>
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
          :rotate-icon="processing"
          :disabled="processing">
          Change password
        </ButtonBasic>
      </template>
    </Controller>
  </form>
</article>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import store from '../../store-legacy';
import getData from '../../structure/users/item';
import { post, checkForms, formData } from '../../libs/api';
import { logout } from '../../libs/auth';
import { err } from '../../libs/error';
import { printf } from '../../libs/string';
import { message } from '../../message';
import { toast } from '../../modules/toast';
import PageHeader from '../../components/page/header/index.vue';
import { FormInput } from '../../components/forms';
import { Fieldset, Field, Help } from '../../components/forms/fieldset';
import { Controller } from '../../components/navigation';
import ButtonBasic from '../../components/button/basic.vue';

const root = ref();
const router = useRouter();
const route = useRoute();
const forms = reactive({
  srl: '',
  email: '',
  password: { value: '', error: null },
  password_new: { value: '', error: null },
  password_new2: { value: '', error: null },
});
const processing = ref(false);
const loading = ref(false);
const self = computed(() => (store.state.user.srl === Number(route.params.srl)));

async function onSubmit()
{
  forms.password_new.error = null;
  forms.password_new2.error = null;
  if (forms.password_new.value !== forms.password_new2.value)
  {
    forms.password_new2.error = message.words.guideVerifyPassword;
    root.value.password_new2.focus();
    return;
  }
  if (forms.password.value === forms.password_new.value)
  {
    forms.password_new.error = message.words.guideSamePassword;
    root.value.password_new.focus();
    return;
  }

  try
  {
    processing.value = true;
    checkForms(forms);
    const data = formData({
      password: forms.password.value,
      new_password: forms.password_new.value,
      confirm_password: forms.password_new2.value,
    });
    await post(`/users/${route.params.srl}/change-password/`, data);
    processing.value = false;
    if (self.value)
    {
      if (!confirm(`${printf(message.success.change, message.word.password)} ${message.confirm.logout}`)) return;
      await logout();
    }
    else
    {
      await router.push(`/users/${route.params.srl}/`);
      toast.add(printf(message.success.change, message.word.password), 'success');
    }
  }
  catch (e)
  {
    err([ '/pages/users/change-password.vue', 'onSubmit()' ], 'error', e.message);
    processing.value = false;
    toast.add(printf(message.fail.change, message.word.password), 'error');
  }
}

onMounted(async () => {
  try
  {
    if (!route.params.srl) throw new Error('no srl');
    loading.value = true;
    let res = await getData({ url: `/users/${route.params.srl}/` });
    forms.srl = res.srl;
    forms.email = res.email;
    loading.value = false;
  }
  catch (e)
  {
    err([ '/pages/users/change-password.vue', 'onMounted()' ], 'error', e.message);
    throw e.message;
  }
});
</script>

<style lang="scss" scoped>
.fields {
  &__password {
    --input-width: 300px;
  }
}
</style>
