<template>
<form @submit.prevent="onSubmit" ref="form">
  <fieldset class="rg-form-fieldset">
    <legend>{{type}} category form</legend>
    <dl class="rg-form-field">
      <dt><label for="name">Name</label></dt>
      <dd>
        <form-text
          type="text"
          name="name"
          id="name"
          v-model="forms.name.value"
          placeholder="landscape"
          :maxlength="40"
          :size="30"
          :error="!!forms.name.error"
          :required="true"
          :inline="true"/>
      </dd>
    </dl>
  </fieldset>
  <nav-bottom>
    <template slot="left">
      <button-basic type="button" label="Back" icon-left="arrow-left" @click="$router.back()"/>
    </template>
    <template slot="right">
      <button-basic
        type="submit"
        color="key"
        :label="!processing ? `${this.type === 'edit' ? 'Edit' : 'Add'} Category` : null"
        :icon-right="processing ? 'loader' : ''"
        :rotate-icon="processing"
        :disabled="processing"/>
    </template>
  </nav-bottom>
</form>
</template>

<script>
import { formData } from '../../../libs/forms';
import * as messages from '../../../libs/messages';

export default {
  components: {
    'form-text': () => import('~/components/form/text'),
    'button-basic': () => import('~/components/button/basic'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
  },
  props: {
    type: { type: String, default: 'add' }, // add,edit
    srl: { type: [Number,String] },
    nest_srl: { type: [Number,String], required: true },
    data: {
      name: { type: String },
    },
  },
  data()
  {
    return {
      processing: false,
      forms: {
        name: {
          value: this.data ? this.data.name : '',
          error: null,
        }
      }
    };
  },
  methods: {
    async onSubmit(e)
    {
      try
      {
        this.processing = true;
        const data = formData({
          nest_srl: this.nest_srl || null,
          name: this.forms.name.value
        });
        let url = (this.type === 'edit' && this.srl) ? `/categories/${this.srl}/edit/` : '/categories/';
        let res = await this.$axios.$post(url, data);
        if (!res.success) throw res.message;
        this.processing = false;
        if (this.type === 'edit') this.$router.push(`../../`);
        else this.$router.replace('../');
      }
      catch(e)
      {
        if (e === messages.error.service) e = null;
        this.processing = false;
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed ${this.type} category.`,
          color: 'error',
        });
      }
    },
  },
}
</script>
