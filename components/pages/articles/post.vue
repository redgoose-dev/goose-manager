<template>
<form @submit.prevent="onSubmit" ref="form">
  <field-wrap :legend="`${type} article form`" :hide-legend="true">
    <field v-if="datas.categories && datas.categories.length" label="Category" for="category">
      <template slot="body">
        <form-select
          name="category"
          id="category"
          v-model="forms.category_srl"
          :options="datas.categories"
          :required="false"
          :inline="true"/>
      </template>
    </field>
    <field label="Title" for="title">
      <template slot="body">
        <form-text
          type="text"
          name="title"
          id="title"
          v-model="forms.title.value"
          placeholder="article title"
          :maxlength="120"
          :error="!!forms.title.error"
          :required="true"/>
      </template>
    </field>
    <field label="Type" for="type">
      <template slot="body">
        <div class="rg-row rg-row-v-center rg-row-gutter-h">
          <label class="form-field">
            <form-radio name="type" id="type" v-model="forms.type" :value="null"/>
            <span>Visible</span>
          </label>
          <label class="form-field">
            <form-radio name="type" v-model="forms.type" value="hidden"/>
            <span>Hidden</span>
          </label>
        </div>
      </template>
    </field>
    <field label="Order date" for="order">
      <form-text
        type="text"
        name="order"
        id="order"
        v-model="forms.order.value"
        placeholder="2019-05-05"
        :maxlength="10"
        :size="20"
        :error="!!forms.order.error"
        :required="true"
        :inline="true"
        @change="onChangeOrder"/>
      <p v-if="!!forms.order.error" class="form-help form-help--error">
        {{forms.order.error}}
      </p>
    </field>
  </field-wrap>

  <editor
    ref="editor"
    name="content"
    id="content"
    v-model="forms.content.value"
    placeholder="article content body"
    :rows="18"
    :required="true"
    @position="onChangePosition"
    className="editor">
    <template slot="nav">
      <button-basic
        type="button"
        size="small"
        color="gray"
        icon-right="eye"
        :inline="true"
        @click="(e) => $refs.editor.onPreview(e)">
        Preview
      </button-basic>
    </template>
  </editor>

  <uploader
    ref="$uploader"
    :article="datas.article"
    :files="datas.files"
    :nest="datas.nest"
    :options="{}"
    @insert-editor="insertFileToEditor"/>

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
        {{this.type === 'edit' ? 'Edit' : 'Add'}} article
      </button-basic>
    </template>
  </nav-bottom>
</form>
</template>

<script>
import { formData } from '~/libs/forms';
import * as messages from '~/libs/messages';
import * as text from '~/libs/text';
import * as dates from '~/libs/dates';
import * as fieldset from '~/components/form/fieldset';

const errorMessage = {
  order: `Please type in '2019-12-25' format.`,
};

export default {
  name: 'post-article',
  components: {
    'form-text': () => import('~/components/form/text'),
    'form-select': () => import('~/components/form/select'),
    'form-radio': () => import('~/components/form/radio'),
    'button-basic': () => import('~/components/button/basic'),
    'editor': () => import('~/components/pages/articles/editor'),
    'uploader': () => import('~/components/pages/articles/uploader'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'field-wrap': fieldset.wrap,
    'field': fieldset.field,
  },
  props: {
    type: { type: String, default: 'add' }, // add,edit
    srl: { type: [Number,String], default: null },
    nest_srl: { type: [Number,String] },
    category_srl: { type: [Number,String] },
    page: { type: [Number,String] },
    skin: { type: String, default: 'default' },
    datas: {
      type: Object,
      required: true,
      nest: { type: Object, required: true },
      categories: { type: Array, default: [] },
      article: { type: Object },
      files: { type: Array, default: [] },
    }
  },
  data()
  {
    const { datas, nest_srl } = this;
    return {
      processing: false,
      forms: {
        app_srl: datas.nest ? datas.nest.app_srl : null,
        nest_srl: datas.article ? datas.article.nest_srl : nest_srl,
        category_srl: this.getCategoryInForm(),
        type: datas.article ? (this.getTypeName(datas.article.type) || null) : null,
        title: {
          value: datas.article ? datas.article.title : '',
          error: '',
        },
        content: {
          value: datas.article ? datas.article.content : '',
          error: '',
        },
        json: this.getJSON(),
        order: {
          value: datas.article ? datas.article.order : dates.convertDateFormat(null, true),
          error: '',
        },
      },
      editor: {
        start: 0,
        end: 0,
      },
    };
  },
  methods: {
    async onSubmit(e)
    {
      // check value
      if (!/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.test(this.forms.order.value))
      {
        this.forms.order.error = errorMessage.order;
        return;
      }

      // set values
      const data_article = this.datas.article;
      const { $uploader } = this.$refs;
      let json = Object.assign({}, this.forms.json);

      // on loading
      this.processing = true;

      // merge uploader data
      let thumbnail = null;
      let updatedThumbnail = false;
      if ($uploader.thumbnailOptions)
      {
        // 이전 이미지는 삭제한다. 삭제 실패하더라도 넘어간다.
        if (!!(data_article && data_article.json.thumbnail))
        {
          await this.$axios.$post(
            `/files/remove-file/`,
            formData({
              path: data_article.json.thumbnail.path
            })
          );
        }

        try
        {
          // 새로운 썸네일 이미지를 업로드한다.
          if ($uploader.thumbnailOptions.src)
          {
            let res_uploadSource = await this.$axios.$post(
              `/files/upload-file/`,
              formData({
                sub_dir: 'thumbnail',
                file: $uploader.thumbnailOptions.src,
              })
            );
            if (!res_uploadSource.success) throw res_uploadSource.message;
            if (!res_uploadSource.data.path) throw 'not found source path';

            // make option
            thumbnail = {
              srl: $uploader.thumbnailOptions.srl,
              sizeSet: $uploader.sizeSet,
              points: $uploader.thumbnailOptions.points,
              zoom: $uploader.thumbnailOptions.zoom,
              path: res_uploadSource.data.path,
            };
          }
          else
          {
            // `$uploader.thumbnailOptions` 객체는 있지만 src가 없으면 썸네일 이미지를 삭제한다고 인식하고 값을 비워야 한다.
            thumbnail = null;
          }
          updatedThumbnail = true;
        }
        catch(e)
        {
          this.processing = false;
          this.$toast.add({ message: e, color: 'error' });
          return;
        }
      }

      try
      {
        // assign json
        if (updatedThumbnail) json.thumbnail = thumbnail;

        let data = {
          app_srl: this.forms.app_srl,
          nest_srl: this.forms.nest_srl,
          category_srl: this.forms.category_srl || '',
          type: this.getTypeName(this.forms.type),
          title: this.forms.title.value,
          content: this.forms.content.value,
          json: encodeURIComponent(JSON.stringify(json)),
          order: this.forms.order.value,
        };
        data = formData(data);
        let res = await this.$axios.$post(
          this.type === 'edit' ? `/articles/${this.srl}/edit/` : '/articles/',
          data
        );
        if (!res.success) throw res.message;

        // update files
        const files = this.$refs.$uploader.uploader.queue.items.files;
        if (files && files.length)
        {
          let srls = [];
          files.forEach((o) => {
            if (o.ready !== 1) return;
            srls.push(this.$axios.$post(
              `/files/${o.srl}/edit/`,
              formData({
                article_srl: this.srl || res.srl,
                ready: 0
              })
            ));
          });
          if (srls.length)
          {
            let res_file = await Promise.all(srls);
            for (let i=0; i<res_file.length; i++)
            {
              if (!res_file[i].success) throw res_file[i].message;
            }
          }
        }

        this.processing = false;

        // redirect
        switch (this.type)
        {
          case 'edit':
          case 'add':
            let params = {};
            if (this.nest_srl) params.nest = this.nest_srl;
            if (this.category_srl) params.category = this.category_srl;
            if (this.page && this.page > 1) params.page = this.page;
            this.$router.push(`../${text.serialize(params, true)}`);
            break;
          default:
            this.$router.push('/articles/');
            break;
        }
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
    getJSON()
    {
      if (!this.datas.article) return {};
      return Object.assign({}, this.datas.article.json);
    },
    getCategoryInForm()
    {
      if (this.datas.article) return this.datas.article.category_srl;
      if (this.category_srl === 'null') return null;
      return this.category_srl || null;
    },
    getTypeName(type)
    {
      switch (type)
      {
        case 'hidden':
          return 'hidden';
        default:
          return '';
      }
    },
    onChangePosition(op)
    {
      this.editor.start = op.start;
      this.editor.end = op.end;
    },
    insertFileToEditor(res)
    {
      let content = this.forms.content.value + '';
      let pos = this.editor.start;
      // 시작글자에서 붙인다면 처음 `\n`가 삭제됨
      if (pos === 0) res = res.replace(/^\n/g, '');
      this.forms.content.value = content.substr(0, pos) + res + content.substr(pos);
      this.editor.start += res.length;
    },
    onChangeOrder(text)
    {
      // check value
      if (this.forms.order.value.length === 10 && !/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.test(this.forms.order.value))
      {
        this.forms.order.error = errorMessage.order;
      }
      else if (this.forms.order.error)
      {
        this.forms.order.error = '';
      }
    },
  },
}
</script>
