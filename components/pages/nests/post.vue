<template>
<form @submit.prevent="onSubmit" ref="form" class="post">

  <wrap legend="Basic fields">
    <field label="App" id="apps">
      <form-select
        slot="body"
        id="apps"
        name="apps"
        v-model="forms.app_srl.value"
        :options="apps"
        :required="true"
        :inline="true"/>
    </field>
    <field label="ID" id="id">
      <template slot="body">
        <form-text
          id="id"
          name="id"
          v-model="forms.id.value"
          :error="!!forms.id.error"
          placeholder="Nest ID"
          :maxlength="20"
          :inline="true"
          :required="true"/>
        <p v-if="!!forms.id.error" class="rg-form-help rg-form-help-error">
          {{forms.id.error}}
        </p>
        <p class="rg-form-help">영문과 숫자 `-`, `_`만 입력 가능합니다.</p>
      </template>
    </field>
    <field label="Name" id="name">
      <template slot="body">
        <form-text
          id="name"
          name="name"
          v-model="forms.name.value"
          :maxlength="40"
          :size="30"
          placeholder="Nest name"
          :inline="true"
          :required="true"/>
      </template>
    </field>
    <field label="Description" id="description">
      <template slot="body">
        <form-text
          id="description"
          name="description"
          v-model="forms.description.value"
          :maxlength="100"
          placeholder="Description word"/>
        <p class="rg-form-help">이 Nest에 대한 설명을 입력합니다.</p>
      </template>
    </field>
  </wrap>

  <wrap legend="Extra fields" class="extra-field">
    <field label="Using category" id="use_category">
      <template slot="body">
        <form-checks
          type="radio"
          name="use_category"
          id="use_category"
          v-model="json.useCategory"
          :inline="true"
          :disabled="false"
          :items="[
            { label: 'Yes', value: 1 },
            { label: 'No', value: 0 },
          ]"/>
        <p class="rg-form-help">분류를 사용할지에 대하여 결정합니다.</p>
      </template>
    </field>
    <field label="Article skin" id="article_skin">
      <template slot="body">
        <form-checks
          type="radio"
          name="article_skin"
          id="article_skin"
          v-model="json.articleSkin"
          :inline="true"
          :disabled="false"
          :items="[
            { label: 'List', value: 'list' },
            { label: 'Card', value: 'card' },
            { label: 'Thumbnail', value: 'thumbnail' },
          ]"/>
        <p class="rg-form-help">`Articles` 목록의 스킨입니다.</p>
      </template>
    </field>
    <field label="Thumnail" id="thumbnail_width">
      <template slot="body">
        <div>
          <label class="rg-form-field-inline">
            <span>Width:</span>
            <form-text
              id="thumbnail_width"
              name="thumbnail_width"
              v-model="json.thumbnail.width"
              placeholder="100"
              :maxlength="3"
              :size="5"
              :inline="true"/>
            <span>px</span>
          </label>
          <span style="margin-right:15px">,</span>
          <label class="rg-form-field-inline">
            <span>Height:</span>
            <form-text
              id="thumbnail_height"
              name="thumbnail_width"
              v-model="json.thumbnail.height"
              placeholder="100"
              :maxlength="3"
              :size="5"
              :inline="true"/>
            <span>px</span>
          </label>
        </div>
        <div style="margin-top:6px">
          <form-checks
            type="radio"
            name="thumbnail_type"
            id="thumbnail_type"
            v-model="json.thumbnail.type"
            :inline="true"
            :disabled="false"
            :items="[
              { label: 'crop', value: 'crop' },
              { label: 'resize', value: 'resize' },
              { label: 'resize(width)', value: 'resizeWidth' },
              { label: 'resize(height)', value: 'resizeHeight' },
            ]"/>
        </div>
      </template>
    </field>
    <field label="Thumbnail size tool" id="thumbnail_size_tool">
      <template slot="body">
        <form-checks
          type="radio"
          name="thumbnail_size_tool"
          id="thumbnail_size_tool"
          v-model="json.useThumbnailSizeTool"
          :inline="true"
          :disabled="false"
          :items="[
            { label: 'Yes', value: 1 },
            { label: 'No', value: 0 },
          ]"/>
        <p class="rg-form-help">썸네일 사이즈 선택하는 툴을 사용합니다.</p>
      </template>
    </field>
    <field label="Files" id="files_count">
      <template slot="body">
        <div>
          <label class="rg-form-field-inline">
            <span>Count:</span>
            <form-text
              id="files_count"
              name="files_count"
              v-model="json.files.count"
              placeholder="10"
              :maxlength="2"
              :size="3"
              :inline="true"/>
          </label>
        </div>
        <div style="margin-top:6px">
          <label class="rg-form-field-inline">
            <span>Size(single):</span>
            <form-text
              id="files_size_limit_single"
              name="files_size_limit_single"
              v-model="json.files.sizeSingle"
              placeholder="2000000"
              :maxlength="9"
              :size="15"
              :inline="true"/>
            <span>byte</span>
          </label>
          <span style="margin-right:15px">,</span>
          <label class="rg-form-field-inline">
            <span>Size(total):</span>
            <form-text
              id="files_size_total"
              name="files_size_total"
              v-model="json.files.sizeTotal"
              placeholder="15000000"
              :maxlength="9"
              :size="15"
              :inline="true"/>
            <span>byte</span>
          </label>
        </div>
      </template>
    </field>
  </wrap>

  <nav-bottom>
    <template slot="left">
      <button-basic type="button" label="Back" icon-left="arrow-left" @click="$router.back()"/>
    </template>
    <template slot="right">
      <button-basic
        type="submit"
        color="key"
        :label="`${computedTypeLabel} Nest`"
        :icon-left="processing ? 'loader' : 'check'"
        :rotate-icon="processing"
        :disabled="processing"/>
    </template>
  </nav-bottom>
</form>
</template>

<script>
import { checkId, formData } from '~/libs/forms';
import * as messages from '~/libs/messages';
import * as articlePreference from '~/libs/articles/preference';
import * as fieldset from '~/components/form/fieldset';

const defaultJson = {
  useCategory: 0,
  articleSkin: 'card',
  thumbnail: {
    width: 300,
    height: 200,
    type: 'crop',
  },
  useThumbnailSizeTool: 0,
  files: {
    count: 15,
    sizeSingle: 3000000,
    sizeTotal: 30000000
  },
};

export default {
  components: {
    'form-text': () => import('~/components/form/text'),
    'form-checks': () => import('~/components/form/checks'),
    'form-select': () => import('~/components/form/select'),
    'button-basic': () => import('~/components/button/basic'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'wrap': fieldset.wrap,
    'field': fieldset.field,
  },
  props: {
    type: { type: String, default: 'add' },
    srl: { type: Number },
    redirectUrl: { type: String, default: '../' },
    datas: {
      type: Object,
      apps: { type: Array },
      nest: { type: Object },
    },
  },
  data()
  {
    const { nest, apps } = this.datas;

    let result = {
      forms: {
        app_srl: {
          value: nest ? nest.app_srl : '',
          error: null,
        },
        id: {
          value: nest ? nest.id : '',
          error: null,
        },
        name: {
          value: nest ? nest.name : '',
          error: null,
        },
        description: {
          value: nest ? nest.description : '',
          error: null,
        }
      },
      apps: apps.map((o, k) => {
        return {
          label: `[${o.id}] ${o.name}`,
          value: o.srl,
        };
      }),
      processing: false,
    };

    try
    {
      if (!nest) throw 'no nest';
      result.nest = nest;
      result.json = {
        ...defaultJson,
        useCategory: parseInt(nest.json.useCategory) || 0,
        articleSkin: nest.json.articleSkin,
        thumbnail: {
          width: parseInt(nest.json.thumbnail.width),
          height: parseInt(nest.json.thumbnail.height),
          type: nest.json.thumbnail.type,
        },
        useThumbnailSizeTool: parseInt(nest.json.useThumbnailSizeTool) || 0,
        files: {
          count: parseInt(nest.json.files.count),
          sizeSingle: parseInt(nest.json.files.sizeSingle),
          sizeTotal: parseInt(nest.json.files.sizeTotal)
        }
      };
    }
    catch(e)
    {
      result.nest = {};
      result.json = defaultJson;
    }
    return result;
  },
  computed: {
    computedTypeLabel() {
      return (this.type === 'edit') ? 'Edit' : 'Add';
    },
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
        // set json field
        let json = Object.assign({}, this.json);
        // request api
        this.processing = true;
        const data = formData({
          app_srl: this.forms.app_srl.value,
          id: this.forms.id.value,
          name: this.forms.name.value,
          description: this.forms.description.value,
          json: encodeURIComponent(JSON.stringify(json)),
        });
        let res = await this.$axios.$post(
          this.type === 'edit' ? `/nests/${this.srl}/edit/` : '/nests/',
          data
        );
        if (!res.success) throw res.message;
        this.processing = false;
        this.$router.push(this.redirectUrl);
      }
      catch(e)
      {
        if (e === messages.error.service) e = null;
        this.processing = false;
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed ${this.type} nest.`,
          color: 'error',
        });
      }
    },
  },
}
</script>

<style src="./post.scss" lang="scss" scoped/>
