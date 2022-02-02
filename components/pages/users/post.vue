<template>
<form @submit.prevent="onSubmit" ref="form">
  <field-wrap legend="add user form" :hide-legend="true">
    <field label="E-mail" for="email">
      <template slot="body">
        <form-text
          v-model="forms.email.value"
          :error="forms.email.error"
          type="email"
          name="email"
          id="email"
          placeholder="name@address.com"
          :maxlength="60"
          :size="35"
          :inline="true"
          :required="true"
          :disabled="type === 'edit'"/>
        <p v-if="type === 'edit'" class="form-help form-help-error">
          이메일 주소는 수정할 수 없습니다.
        </p>
      </template>
    </field>
    <field label="Name" for="name">
      <template slot="body">
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
      </template>
    </field>
    <field v-if="type === 'add'" label="Password" for="password">
      <template slot="body">
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
      </template>
    </field>
    <field v-if="type === 'add'" label="Confirm password" for="password2">
      <template slot="body">
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
          :inline="true"/>
        <p v-if="!!forms.password2.error" class="rg-form-help rg-form-help-error">
          {{forms.password2.error}}
        </p>
      </template>
    </field>
    <field v-if="computedShowAdminField" label="Admin" for="admin">
      <template slot="body">
        <label class="form-field">
          <span><form-checkbox name="admin" id="admin" v-model="forms.admin.value"/></span>
          <span for="admin">체크하면 관리자 권한으로 사용합니다.</span>
        </label>
      </template>
    </field>
  </field-wrap>
  <nav-bottom>
    <template slot="left">
      <button-basic
        type="button"
        icon-left="arrow-left"
        @click="$router.back()">
        Back
      </button-basic>
    </template>
    <template slot="right">
      <button-basic
        type="submit"
        color="key"
        :icon-left="processing ? 'loader' : 'check'"
        :rotate-icon="processing"
        :disabled="processing">
        {{type === 'edit' ? 'Edit' : 'Add'}} user
      </button-basic>
    </template>
  </nav-bottom>
</form>
</template>

<script>
import { formData } from "~/libs/forms";
import * as messages from "~/libs/messages";
import * as fieldset from '~/components/form/fieldset';

export default {
  name: 'post',
  components: {
    'form-text': () => import('~/components/form/text'),
    'form-checkbox': () => import('~/components/form/checkbox'),
    'button-basic': () => import('~/components/button/basic'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'field-wrap': fieldset.wrap,
    'field': fieldset.field,
  },
  props: {
    type: { type: String, default: 'add' }, // add,edit
    datas: { type: Object },
  },
  data()
  {
    return {
      srl: this.datas ? this.datas.srl: null,
      forms: {
        email: {
          value: this.datas ? this.datas.email : '',
          error: null,
        },
        name: {
          value: this.datas ? this.datas.name : '',
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
        admin: {
          value: !!(this.datas && Number(this.datas.admin) === 1),
          error: null,
        },
      },
      processing: false,
    };
  },
  computed: {
    computedShowAdminField()
    {
      const { type, $store } = this;
      const { authUser } = $store.state;
      if (this.datas && authUser.srl === parseInt(this.datas.srl)) return false;
      return type === 'add' || (authUser && authUser.admin);
    },
  },
  methods: {
    async onSubmit()
    {
      this.processing = true;
      if (this.type === 'add')
      {
        // check password
        if (this.forms.password.value !== this.forms.password2.value)
        {
          this.forms.password2.error = messages.error.confirmPassword;
          this.$refs.form.password2.focus();
          return;
        }
      }
      try
      {
        let params = {
          email: this.forms.email.value,
          name: this.forms.name.value,
          password: this.forms.password.value,
          password2: this.forms.password2.value,
          admin: !!this.forms.admin.value ? 1 : 0,
        };
        if (this.type === 'edit')
        {
          delete params.email;
          delete params.password;
          delete params.password2;
        }
        const data = formData(params);
        const path = this.type === 'edit' ? `/users/${this.srl}/edit/` : '/users/';
        let res = await this.$axios.$post(path, data);
        if (!res.success) throw res.message;
        this.processing = false;
        await this.$router.push('../');
      }
      catch(e)
      {
        if (e === messages.error.service) e = null;
        this.processing = false;
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed ${type} user.`,
          color: 'error',
        });
      }
    },
  },
}
</script>
