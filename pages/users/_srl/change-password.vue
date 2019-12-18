<template>
<article>
  <page-header module="users" title="Change user password"/>

  <form @submit.prevent="onSubmit" ref="form">
    <fieldset class="rg-form-fieldset">
      <legend>change password form</legend>
      <dl class="rg-form-field">
        <dt><label for="password">Current password</label></dt>
        <dd>
          <form-text
            type="password"
            name="password"
            id="password"
            v-model="forms.password.value"
            :maxlength="24"
            :size="32"
            :error="!!forms.password.error"
            :required="true"
            :inline="true"/>
        </dd>
      </dl>
      <dl class="rg-form-field">
        <dt><label for="password_new">New password</label></dt>
        <dd>
          <form-text
            type="password"
            name="password_new"
            id="password_new"
            v-model="forms.password_new.value"
            :maxlength="24"
            :size="32"
            :error="!!forms.password_new.error"
            :required="true"
            :inline="true"/>
        </dd>
      </dl>
      <dl class="rg-form-field">
        <dt><label for="password_new2">Confirm password</label></dt>
        <dd>
          <form-text
            type="password"
            name="password_new2"
            id="password_new2"
            v-model="forms.password_new2.value"
            :maxlength="24"
            :size="32"
            :error="!!forms.password_new2.error"
            :required="true"
            :inline="true"/>
          <p v-if="!!forms.password_new2.error" class="rg-form-help rg-form-help-error">
            {{forms.password_new2.error}}
          </p>
          <p class="rg-form-help">
            Please input a password such as "new password".
          </p>
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
          :label="!processing ? 'Change password' : null"
          :icon="processing ? 'cached' : ''"
          :rotateIcon="processing"
          :disabled="processing"/>
      </template>
    </nav-bottom>
  </form>
</article>
</template>

<script>
import { formData } from '../../../libs/forms';
import * as messages from '../../../libs/messages';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'form-text': () => import('~/components/form/text'),
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
      forms: {
        password: {
          value: '',
          error: null,
        },
        password_new: {
          value: '',
          error: null,
        },
        password_new2: {
          value: '',
          error: null,
        },
      },
      processing: false,
      self: parseInt(this.$store.state.authUser.srl) === parseInt(this.$route.params.srl),
    };
  },
  methods: {
    async onSubmit(e)
    {
      // reset error
      this.forms.password_new2.error = null;

      // check password
      if (this.forms.password_new.value !== this.forms.password_new2.value)
      {
        this.forms.password_new2.error = messages.error.confirmPassword;
        this.$refs.form.password_new2.focus();
        return;
      }

      try
      {
        this.processing = true;
        const data = formData({
          password: this.forms.password.value,
          new_password: this.forms.password_new.value,
          confirm_password: this.forms.password_new2.value,
        });
        let res = await this.$axios.$post(`/users/${this.$route.params.srl}/change-password/`, data);
        if (!res.success) throw res.message;
        this.processing = false;

        // reset form
        this.forms.password.value = '';
        this.forms.password_new.value = '';
        this.forms.password_new2.value = '';

        // 자신의 계정이면 로그아웃 할건지 물어보기
        if (this.self)
        {
          if (confirm(messages.msg.questionChangePassword))
          {
            this.$router.replace('/auth/logout/');
          }
        }
        else
        {
          this.$toast.add({
            message: messages.msg.successChangePassword,
            color: 'success',
          });
        }
      }
      catch(e)
      {
        if (e === messages.error.service) e = null;
        this.processing = false;
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : messages.msg.failedChangePassword,
          color: 'error',
        });
      }
    }
  }
}
</script>