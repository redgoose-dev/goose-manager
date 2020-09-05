<template>
<main class="login">
  <div class="login__wrap">
    <article class="login__body">
      <h1 class="login__title">{{computedName}}</h1>
      <h2 class="login__description">{{computedDescription}}</h2>
      <form ref="form" @submit.prevent="onSubmit" class="login__form">
        <fieldset class="login__fieldset">
          <legend>login form</legend>
          <div class="login__field">
            <label for="email" class="login__field-label">E-Mail</label>
            <div>
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
          <div class="login__field">
            <label for="password" class="login__field-label">Password</label>
            <div>
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
          <div class="login-save-auth">
            <label>
              <form-checkbox name="save_auth" v-model="forms.save"/>
              <span>Keep me signed in.</span>
            </label>
          </div>
        </fieldset>

        <nav class="login__nav">
          <button-basic
            type="submit"
            :icon-right="processing ? 'loader' : 'power'"
            :rotate-icon="processing"
            size="large"
            color="key"
            :disabled="processing"
            class="button">
            Sign in
          </button-basic>
        </nav>
      </form>
    </article>
  </div>
</main>
</template>

<script>
import { formData } from '~/libs/forms';
import * as messages from '~/libs/messages';

export default {
  name: 'page-login',
  components: {
    'form-checkbox': () => import('~/components/form/checkbox'),
    'button-basic': () => import('~/components/button/basic'),
  },
  layout: 'blank',
  middleware: 'login',
  data()
  {
    return {
      forms: {
        email: '',
        password: '',
        save: true,
      },
      processing: false,
    };
  },
  computed: {
    computedName()
    {
      const { preference } = this.$store.state;
      return preference.name;
    },
    computedDescription()
    {
      const { preference } = this.$store.state;
      return preference.description;
    }
  },
  mounted()
  {
    this.$refs.form.email.focus();
  },
  methods: {
    async onSubmit(e)
    {
      const { $axios, $store } = this;
      const { preference, path_root } = $store.state;
      // off processing
      this.processing = true;
      // request api
      try
      {
        const data = formData({
          email: this.forms.email,
          password: this.forms.password,
          host: location.host,
        });
        const resultApi = await $axios.$post('/auth/login/', data);
        if (!(resultApi.success && resultApi.data && resultApi.data.email)) throw new Error(resultApi.message);

        // save session
        const resultParams = {
          ...resultApi.data,
          save: this.forms.save,
        };
        const resultSession = await $axios.$post(`${$store.state.url_app}/api/session-save/`, resultParams);
        if (!(resultSession && resultSession.success))
        {
          throw new Error(resultSession.message || messages.error.failedLogin);
        }

        // reset form
        this.processing = false;
        this.forms.email = '';
        this.forms.password = '';

        // redirect home
        location.href = `${path_root}/`;
      }
      catch(e)
      {
        if (preference.debug.service) console.error(e.message);
        this.processing = false;
        this.$toast.add({
          message: messages.error.failedLogin,
          color: 'error'
        });
      }
    },
  },
};
</script>

<style lang="scss" src="./login.scss" scoped/>
