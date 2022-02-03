<template>
<form @submit.prevent="onSubmit" ref="form" class="post">
  <field-wrap legend="Basic fields">
    <field label="App" for="apps">
      <form-select
        slot="body"
        id="apps"
        name="apps"
        v-model="forms.app_srl.value"
        :options="apps"
        :required="true"
        :inline="true"/>
    </field>
    <field label="ID" for="id">
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
        <p v-if="!!forms.id.error" class="form-help form-help-error">
          {{forms.id.error}}
        </p>
        <p class="form-help">영문과 숫자 `-`, `_`만 입력 가능합니다.</p>
      </template>
    </field>
    <field label="Name" for="name">
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
    <field label="Description" for="description">
      <template slot="body">
        <form-text
          id="description"
          name="description"
          v-model="forms.description.value"
          :maxlength="100"
          placeholder="Description word"/>
        <p class="form-help">이 Nest에 대한 설명을 입력합니다.</p>
      </template>
    </field>
  </field-wrap>

  <field-wrap legend="Extra fields" class="extra-field">
    <field label="Using category" for="use_category">
      <template slot="body">
        <div class="rg-row rg-row-v-center rg-row-gutter-h">
          <label class="form-field">
            <form-radio name="use_category" id="use_category" v-model="json.useCategory" value="1"/>
            <span>Yes</span>
          </label>
          <label class="form-field">
            <form-radio name="use_category" v-model="json.useCategory" value="0"/>
            <span>No</span>
          </label>
        </div>
        <p class="form-help">분류를 사용할지에 대하여 결정합니다.</p>
      </template>
    </field>
    <field label="Thumnail size" for="thumbnail_width">
      <template slot="body">
        <div class="rg-row rg-row-v-center rg-row-gutter-h">
          <div class="form-field">
            <label for="thumbnail_width">Width:</label>
            <form-text
              id="thumbnail_width"
              name="thumbnail_width"
              v-model="json.thumbnail.width"
              placeholder="100"
              :maxlength="3"
              :size="5"
              :inline="true"/>
            <span>px</span>
          </div>
          <span></span>
          <div class="form-field">
            <label for="thumbnail_height">Height:</label>
            <form-text
              id="thumbnail_height"
              name="thumbnail_width"
              v-model="json.thumbnail.height"
              placeholder="100"
              :maxlength="3"
              :size="5"
              :inline="true"/>
            <span>px</span>
          </div>
        </div>
      </template>
    </field>
    <field label="Thumnail resize type" for="thumbnail_type">
      <template slot="body">
        <div class="rg-row rg-row-v-center rg-row-gutter-h">
          <label class="form-field">
            <form-radio name="thumbnail_type" id="thumbnail_type" v-model="json.thumbnail.type" value="crop"/>
            <span>crop</span>
          </label>
          <label class="form-field">
            <form-radio name="thumbnail_type" v-model="json.thumbnail.type" value="resize"/>
            <span>resize</span>
          </label>
          <label class="form-field">
            <form-radio name="thumbnail_type" v-model="json.thumbnail.type" value="resizeWidth"/>
            <span>resize(width)</span>
          </label>
          <label class="form-field">
            <form-radio name="thumbnail_type" v-model="json.thumbnail.type" value="resizeHeight"/>
            <span>resize(height)</span>
          </label>
        </div>
      </template>
    </field>
    <field label="Thumbnail size tool" for="thumbnail_size_tool">
      <template slot="body">
        <div class="rg-row rg-row-v-center rg-row-gutter-h">
          <label class="form-field">
            <form-radio
              name="thumbnail_size_tool"
              id="thumbnail_size_tool"
              v-model="json.useThumbnailSizeTool"
              value="1"/>
            <span>Yes</span>
          </label>
          <label class="form-field">
            <form-radio
              name="thumbnail_size_tool"
              v-model="json.useThumbnailSizeTool"
              value="0"/>
            <span>No</span>
          </label>
        </div>
        <p class="form-help">썸네일 사이즈 선택하는 툴을 사용합니다.</p>
      </template>
    </field>
    <field label="Files count" for="files_count">
      <template slot="body">
        <div>
          <form-text
            id="files_count"
            name="files_count"
            v-model="json.files.count"
            placeholder="10"
            :maxlength="2"
            :size="3"
            :inline="true"/>
        </div>
        <p class="form-help">
          업로드 할 수 있는 파일의 갯수를 설정합니다.
        </p>
      </template>
    </field>
    <field
      label="File size(single)"
      label2="File size(total)"
      for="files_size_single"
      for2="files_size_total">
      <div slot="body" class="form-field">
        <div>
          <form-text
            name="files_size_single"
            id="files_size_single"
            v-model="json.files.sizeSingle"
            placeholder="2000000"
            :maxlength="9"
            :size="12"/>
        </div>
        <span>({{json.files.sizeSingle | fileSize}})</span>
      </div>
      <div slot="body2" class="form-field">
        <div>
          <form-text
            name="files_size_total"
            id="files_size_total"
            v-model="json.files.sizeTotal"
            placeholder="15000000"
            :maxlength="9"
            :size="12"/>
        </div>
        <span>({{json.files.sizeTotal | fileSize}})</span>
      </div>
    </field>
    <field label="Using comment" for="use_comment">
      <template slot="body">
        <div class="rg-row rg-row-v-center rg-row-gutter-h">
          <label class="form-field">
            <form-radio
              name="use_comment"
              id="use_comment"
              v-model="json.useComment"
              value="1"/>
            <span>Yes</span>
          </label>
          <label class="form-field">
            <form-radio
              name="use_comment"
              v-model="json.useComment"
              value="0"/>
            <span>No</span>
          </label>
        </div>
        <p class="form-help">댓글을 사용할지에 대하여 선택합니다.</p>
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
        {{computedTypeLabel}} Nest
      </button-basic>
    </template>
  </nav-bottom>
</form>
</template>

<script>
import { checkId, formData } from '~/libs/forms';
import * as messages from '~/libs/messages';
import * as articlePreference from '~/libs/articles/preference';
import * as text from '~/libs/text';
import * as fieldset from '~/components/form/fieldset';

const defaultJson = {
  useCategory: '0',
  thumbnail: {
    width: 400,
    height: 300,
    type: 'crop',
  },
  useThumbnailSizeTool: '0',
  files: {
    count: 15,
    sizeSingle: 5242880,
    sizeTotal: 20971520,
  },
  useComment: '0',
};

export default {
  components: {
    'form-text': () => import('~/components/form/text'),
    'form-select': () => import('~/components/form/select'),
    'button-basic': () => import('~/components/button/basic'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'form-radio': () => import('~/components/form/radio'),
    'field-wrap': fieldset.wrap,
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
    const { type, datas } = this;
    const { apps, nest } = datas;

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
      if (type === 'edit')
      {
        result.nest = nest;
        result.json = {
          ...defaultJson,
          useCategory: nest.json.useCategory || '0',
          thumbnail: {
            width: Number(nest.json.thumbnail.width),
            height: Number(nest.json.thumbnail.height),
            type: nest.json.thumbnail.type,
          },
          useThumbnailSizeTool: nest.json.useThumbnailSizeTool || '0',
          files: {
            count: Number(nest.json.files.count),
            sizeSingle: Number(nest.json.files.sizeSingle),
            sizeTotal: Number(nest.json.files.sizeTotal)
          },
          useComment: nest.json.useComment || '0',
        };
      }
      else
      {
        throw new Error('not edit on type');
      }
    }
    catch(e)
    {
      result.nest = {};
      result.json = JSON.parse(JSON.stringify(defaultJson));
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
  filters: {
    fileSize(value)
    {
      if (!value) return '';
      return text.getFileSize(value);
    },
  },
}
</script>

<style src="./post.scss" lang="scss" scoped/>
