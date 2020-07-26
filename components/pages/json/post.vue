<template>
<form @submit.prevent="onSubmit" ref="form">
  <field-wrap legend="Add JSON form" :hide-legend="true">
    <field label="Name" for="name">
      <template slot="body">
        <form-text
          name="name"
          id="name"
          v-model="forms.name.value"
          placeholder="goose's navigation"
          :maxlength="100"
          :size="30"
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
          placeholder="note comment.."
          :maxlength="100"
          :error="!!forms.description.error"/>
      </template>
    </field>
    <field label="JSON" for="json">
      <template slot="body">
        <form-text
          type="textarea"
          name="json"
          id="json"
          v-model="forms.json.value"
          :placeholder='`{ "foo": "bar" }`'
          :rows="15"
          :error="!!forms.json.error"
          :required="true"/>
        <p v-if="!!forms.json.error" class="form-help form-help-error">
          {{forms.json.error}}
        </p>
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
        {{this.type === 'edit' ? 'Edit' : 'Add'}} JSON
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
    datas: {
      name: { type: String },
      description: { type: String },
      json: { type: String },
    },
  },
  data()
  {
    return {
      srl: this.datas ? this.datas.srl : null,
      forms: {
        name: {
          value: this.datas ? this.datas.name : '',
          error: null,
        },
        description: {
          value: this.datas ? this.datas.description : '',
          error: null,
        },
        json: {
          value: this.datas ? this.datas.json : '',
          error: null,
        },
      },
      processing: false,
    };
  },
  methods: {
    async onSubmit(e)
    {
      // reset error
      this.forms.name.error = null;
      this.forms.json.error = null;

      try
      {
        // check json data
        try
        {
          JSON.parse(this.forms.json.value);
        }
        catch(e)
        {
          this.forms.json.error = messages.msg.failedParsingJson;
          return;
        }

        this.processing = true;
        const data = formData({
          name: this.forms.name.value,
          json: this.forms.json.value,
          description: this.forms.description.value,
        });
        let url = this.type === 'edit' ? `/json/${this.srl}/edit/` : '/json/';
        let res = await this.$axios.$post(url, data);
        if (!res.success) throw res.message;
        this.processing = false;
        // redirect
        this.$router.push('../');
      }
      catch(e)
      {
        if (e === messages.error.service) e = null;
        this.processing = false;
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed ${this.type} JSON.`,
          color: 'error',
        });
      }
    },
  },
}
</script>
