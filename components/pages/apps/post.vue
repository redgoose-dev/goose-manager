<template>
<form @submit.prevent="onSubmit" ref="form">
  <field-wrap :legend="`${type} app form`" :hide-legend="true">
    <field label="ID" for="id">
      <template slot="body">
        <form-text
          name="id"
          id="id"
          v-model="forms.id.value"
          placeholder="app_name"
          :maxlength="16"
          :error="!!forms.id.error"
          :required="true"
          :inline="true"/>
        <p v-if="!!forms.id.error" class="form-help form-help-error">{{forms.id.error}}</p>
        <p class="form-help">
          Please enter only alphanumeric characters `-` and `_`.
        </p>
      </template>
    </field>
    <field label="Name" for="name">
      <template slot="body">
        <form-text
          name="name"
          id="name"
          v-model="forms.name.value"
          placeholder="App name"
          :maxlength="50"
          :error="!!forms.name.error"
          :required="true"
          :inline="true"/>
      </template>
    </field>
    <field label="Description" for="description">
      <template slot="body">
        <form-text
          name="description"
          id="description"
          v-model="forms.description.value"
          placeholder="message"
          :maxlength="100"
          :error="!!forms.description.error"
          :required="false"/>
        <p class="form-help">Description of the app</p>
      </template>
    </field>
  </field-wrap>
  <nav-bottom>
    <template slot="left">
      <button-basic type="button" icon-left="arrow-left" @click="$router.back()">Back</button-basic>
    </template>
    <template slot="right">
      <button-basic
        type="submit"
        color="key"
        :icon-left="processing ? 'loader' : 'check'"
        :rotate-icon="processing"
        :disabled="processing">
        {{this.type === 'edit' ? 'Edit' : 'Add'}} app
      </button-basic>
    </template>
  </nav-bottom>
</form>
</template>

<script>
import { checkId, formData } from '~/libs/forms';
import * as messages from '~/libs/messages';
import * as fieldset from '~/components/form/fieldset';

export default {
  components: {
    'form-text': () => import('~/components/form/text'),
    'button-basic': () => import('~/components/button/basic'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'field-wrap': fieldset.wrap,
    'field': fieldset.field,
  },
  props: {
    type: { type: String, default: 'add' }, // add,edit
    srl: { type: [Number,String] },
    data: {
      id: { type: String },
      name: { type: String },
      description: { type: String },
    },
  },
  data()
  {
    return {
      forms: {
        id: {
          value: this.data ? this.data.id : '',
          error: null,
        },
        name: {
          value: this.data ? this.data.name : '',
          error: null,
        },
        description: {
          value: this.data ? this.data.description : '',
          error: null,
        },
      },
      processing: false,
    };
  },
  methods: {
    async onSubmit(e)
    {
      // reset forms
      this.forms.id.error = null;
      // check id
      const checked = checkId(this.forms.id.value);
      if (!checked)
      {
        this.forms.id.error = 'Please check `id`';
        return;
      }
      try
      {
        this.processing = true;
        // get data
        const data = formData({
          id: this.forms.id.value,
          name: this.forms.name.value,
          description: this.forms.description.value,
        });
        let res = await this.$axios.$post(
          this.type === 'edit' ? `/apps/${this.srl}/edit/` : '/apps/',
          data
        );
        if (!res.success) throw res.message;
        this.processing = false;
        // redirect
        await this.$router.push('/apps/');
      }
      catch(e)
      {
        if (e === messages.error.service) e = null;
        this.processing = false;
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed ${this.type} app.`,
          color: 'error'
        });
      }
    },
  },
}
</script>
