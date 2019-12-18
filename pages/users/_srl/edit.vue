<template>
<article>
  <page-header module="users" title="Edit user"/>
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
            v-model="forms.email"
            placeholder="name@address.com"
            :inline="true"
            :disabled="true"/>
          <p class="rg-form-help rg-form-help-error">이메일 주소는 수정할 수 없습니다.</p>
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
          :label="!processing ? 'Edit User' : null"
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
  validate(cox)
  {
    return cox.params.srl && /^\d+$/.test(cox.params.srl);
  },
  data()
  {
    return {
      srl: parseInt(this.$route.params.srl),
      processing: false,
      isAdmin: this.$store.state.authUser.admin,
    };
  },
  async asyncData(cox)
  {
    try
    {
      let srl = parseInt(cox.params.srl);
      let res = await cox.$axios.$get(`/users/${srl}/`);
      if (!res.success) throw res.message;

      return {
        forms: {
          email: res.data.email,
          name: {
            value: res.data.name,
            error: null,
          },
          admin: parseInt(res.data.admin) === 2,
        },
      };
e		}
    catch(e)
    {
      cox.error({
        statusCode: 500,
        message: (typeof e === 'string') ? e : messages.error.service,
      });
    }
  },
  methods: {
    async onSubmit(e)
    {
      try
      {
        this.processing = true;
        const data = formData({
          name: this.forms.name && this.forms.name.value,
          admin: this.forms.admin ? 2 : 1,
        });
        let res = await this.$axios.$post(`/users/${this.srl}/edit/`, data);
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
  },
}
</script>
