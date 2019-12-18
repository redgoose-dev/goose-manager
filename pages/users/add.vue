<template>
<article>
  <page-header module="users" title="Add user"/>
  <form @submit.prevent="onSubmit" ref="form">
    <fieldset class="rg-form-fieldset">
      <legend>add user form</legend>
      <dl class="rg-form-field">
        <dt><label for="email">E-mail</label></dt>
        <dd>
          <form-text
            type="email"
            name="email"
            id="email"
            v-model="forms.email.value"
            placeholder="name@address.com"
            :maxlength="60"
            :size="35"
            :error="!!forms.email.error"
            :required="true"
            :inline="true"/>
          <p class="rg-form-help">이미 등록된 이메일은 등록할 수 없습니다.</p>
        </dd>
      </dl>
      <dl class="rg-form-field">
        <dt><label for="name">Name</label></dt>
        <dd>
          <form-text
            type="text"
            name="name"
            id="name"
            v-model="forms.name.value"
            placeholder="Please input name"
            :maxlength="30"
            :size="50"
            :error="!!forms.name.error"
            :required="true"
            :inline="true"/>
        </dd>
      </dl>
      <dl class="rg-form-field">
        <dt><label for="password">Password</label></dt>
        <dd>
          <form-text
            type="password"
            name="password"
            id="password"
            v-model="forms.password.value"
						placeholder="Please input password."
            :maxlength="24"
            :size="32"
            :error="!!forms.password.error"
            :required="true"
            :inline="true"/>
        </dd>
      </dl>
      <dl class="rg-form-field">
        <dt><label for="password2">Confirm password</label></dt>
        <dd>
          <form-text
            type="password"
            name="password2"
            id="password2"
            v-model="forms.password2.value"
						placeholder="Please enter the same password."
            :maxlength="24"
            :size="32"
            :error="!!forms.password2.error"
            :required="true"
            :inline="true"
            @change="onChange('password2')"/>
          <p v-if="!!forms.password2.error" class="rg-form-help rg-form-help-error">
            {{forms.password2.error}}
          </p>
        </dd>
      </dl>
      <dl v-if="isAdmin" class="rg-form-field">
        <dt><label for="admin">Admin</label></dt>
        <dd>
          <form-check
            name="admin"
            id="admin"
            label="Check to use as administrator."
            v-model="forms.admin"/>
        </dd>
      </dl>
    </fieldset>
    <nav-bottom>
      <template slot="left">
        <button-basic type="button" label="Back" @click="$router.back()"/>
      </template>
      <template slot="right">
        <button-basic
          type="submit"
          color="key"
          :label="!processing ? 'Add User' : null"
          :icon="processing ? 'cached' : ''"
          :rotateIcon="processing"
          :disabled="processing"/>
      </template>
    </nav-bottom>
  </form>
</article>
</template>

<script>
import { formData } from '~/libs/forms';
import * as messages from '~/libs/messages';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'form-text': () => import('~/components/form/text'),
    'form-check': () => import('~/components/form/check'),
    'button-basic': () => import('~/components/button/basic'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
  },
  data()
  {
    return {
      isAdmin: this.$store.state.authUser.admin,
      forms: {
        email: {
          value: '',
          error: null,
        },
        name: {
          value: '',
          error: null,
        },
        password: {
          value: '',
          error: null,
        },
        password2: {
          value: '',
          error: null,
        },
        admin: false,
      },
      processing: false,
    };
  },
  mounted()
  {
    if (this.$refs.form.email) this.$refs.form.email.focus();
  },
  methods: {
    async onSubmit(e)
    {
      // check password
      if (this.forms.password.value !== this.forms.password2.value)
      {
        this.forms.password2.error = messages.error.confirmPassword;
        this.$refs.form.password2.focus();
        return;
      }

      try
      {
        this.processing = true;
        const data = formData({
          email: this.forms.email.value,
          name: this.forms.name.value,
          password: this.forms.password.value,
          password2: this.forms.password2.value,
          admin: !!this.forms.admin ? 2 : 1,
        });
        let res = await this.$axios.$post('/users/', data);
        if (!res.success) throw res.message;
        this.processing = false;
        this.$router.push('/users/');
      }
      catch(e)
      {
        if (e === messages.error.service) e = null;
        this.processing = false;
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed add user.`,
          color: 'error',
        });
      }
    },
    onChange(field)
    {
      switch (field)
      {
        case 'password2':
          if (this.forms.password.value !== this.forms.password2.value)
          {
            this.forms.password2.error = messages.error.confirmPassword;
          }
          else
          {
            this.forms.password2.error = null;
          }
          break;
        default:
          break;
      }
    },
  },
}
</script>
