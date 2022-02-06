<template>
<article class="login">
  <div class="login__wrap">
    <header>
      <h1 class="login__title">
        {{title}}
      </h1>
      <h2 class="login__description">
        {{description}}
      </h2>
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
/** @var {string} API_URL */
import { computed, reactive, ref } from 'vue';
import axios from 'axios';
import router from '../../router';
import store from '../../store';
import { setup } from '../../libs/service';
import FormCheckbox from '../../components/forms/checkbox.vue';
import ButtonBasic from '../../components/button/basic.vue';

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
      email: 'x@x.x',
      password: '1234',
    });
    // check and set values
    const { success, message, data } = res.data;
    if (!success) throw new Error(message);
    const { user, token } = data;
    if (!(user && token)) throw new Error('not user or token');
    // setup service
    setup(token, user);
    // off loading
    loading.value = false;
    // redirect url
    router.replace('/');
  }
  catch(e)
  {
    loading.value = false;
    // throw new Error(e.message);
  }
}
</script>

<style src="./login.scss" lang="scss" scoped></style>
