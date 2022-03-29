
<template>
<article class="login">
  <div class="login__wrap">
    <header>
      <h1 class="login__title">{{title}}</h1>
      <h2 class="login__description">{{description}}</h2>
    </header>
    <form class="login__body" @submit.prevent="onSubmit">
      <fieldset>
        <legend>login fields</legend>
        <div class="login-field login-field--id">
          <p class="login-field__label">
            <label for="email">E-Mail</label>
          </p>
          <div class="login-field__body">
            <input
              type="email"
              name="email"
              id="email"
              v-model="forms.email"
              maxlength="30"
              placeholder="name@address.com"
              required/>
            <i/>
          </div>
        </div>
        <div class="login-field login-field--password">
          <p class="login-field__label">
            <label for="password">Password</label>
          </p>
          <div class="login-field__body">
            <input
              type="password"
              name="password"
              id="password"
              v-model="forms.password"
              maxlength="30"
              placeholder="Please input password"
              required/>
            <i/>
          </div>
        </div>
        <div class="login-field login-field--save">
          <label class="login-save-auth">
            <FormCheckbox
              name="save_auth"
              v-model="forms.save"
              size="small"/>
            <span>Keep me signed in.</span>
          </label>
        </div>
      </fieldset>
      <nav class="login__nav">
        <ButtonBasic
          type="submit"
          :icon-right="processing ? 'loader' : 'power'"
          :rotate-icon="processing"
          size="large"
          color="key"
          :disabled="processing">
          Sign in
        </ButtonBasic>
      </nav>
    </form>
  </div>
</article>
</template>

<script setup>
/** @var {string} TITLE */
/** @var {string} DESCRIPTION */
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { setup } from '../../libs/service';
import { toast } from '../../modules/toast';
import { err } from '../../libs/error';
import FormCheckbox from '../../components/forms/checkbox.vue';
import ButtonBasic from '../../components/button/basic.vue';

const router = useRouter();
const loading = ref(false);
const title = ref(TITLE || 'manager');
const description = ref(DESCRIPTION || 'manager description');
const processing = ref(false);
const forms = reactive({
  email: '',
  password: '',
  save: true,
});

/**
 * on submit
 * @return {Promise<void>}
 */
async function onSubmit()
{
  try
  {
    // on loading
    loading.value = true;
    // request api
    let res = await axios.post('/local/login/', {
      email: forms.email,
      password: forms.password,
      save: forms.save,
    });
    // check and set values
    const { success, message, data } = res.data;
    if (!success) throw new Error(message);
    // setup service
    const { user, token } = data;
    if (!(user && token)) throw new Error('not user or token');
    await setup(token, user);
    // off loading
    loading.value = false;
    // redirect url
    await router.replace('/');
  }
  catch(e)
  {
    err(['/pages/auth/login.vue', 'onSubmit()'], 'error', e.message);
    loading.value = false;
    toast.add('Failed login.', 'error');
  }
}
</script>

<style src="./login.scss" lang="scss" scoped></style>
