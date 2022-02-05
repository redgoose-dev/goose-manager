<template>
<article class="login">
  <div class="login__wrap">
    <header>
      <h1>{{title}}</h1>
      <h2>{{description}}</h2>
    </header>
    <form @submit.prevent="onSubmit">
      <fieldset>
        <legend>login fields</legend>
        <p>id: <input type="text"></p>
        <p>id: <input type="password"></p>
      </fieldset>
      <button type="submit">Login</button>
    </form>
  </div>
</article>
</template>

<script setup>
/** @var {string} TITLE */
/** @var {string} DESCRIPTION */
/** @var {string} API_URL */
import { computed, ref } from 'vue';
import axios from 'axios';
import router from '../../router';
import store from '../../store';
import { setup } from '../../libs/service';

const loading = ref(false);
const title = ref(TITLE || 'manager');
const description = ref(DESCRIPTION || 'manager description');

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
