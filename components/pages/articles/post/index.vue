<template>
<form @submit.prevent="submit" ref="form">
  <!-- basic fields -->
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
          :required="true"
          :submit-event="true"
          @submit="saveDraft"/>
      </template>
    </field>
    <field label="Order date" label2="Article type" for="order" for2="type">
      <template slot="body">
        <form-text
          type="text"
          name="order"
          id="order"
          v-model="forms.order.value"
          placeholder="2019-05-05"
          :maxlength="10"
          :size="15"
          :error="!!forms.order.error"
          :required="true"
          :inline="true"
          @change="onChangeOrder"/>
        <p v-if="!!forms.order.error" class="form-help form-help--error">
          {{forms.order.error}}
        </p>
      </template>
      <template slot="body2">
        <div class="rg-row rg-row-v-center rg-row-gutter-h">
          <label class="form-field form-field--disabled">
            <form-radio name="type" v-model="forms.type" :disabled="true" value="ready"/>
            <span>ready</span>
          </label>
          <label class="form-field">
            <form-radio name="type" id="type" v-model="forms.type" value="public"/>
            <span>public</span>
          </label>
          <label class="form-field">
            <form-radio name="type" v-model="forms.type" value="private"/>
            <span>private</span>
          </label>
        </div>
      </template>
    </field>
  </field-wrap>
  <!-- // basic fields -->

  <!-- editor -->
  <editor
    ref="editor"
    name="content"
    id="content"
    v-model="forms.content.value"
    placeholder="article content body"
    :required="true"
    @change-position="onChangePositionEditor"
    @insert-text="insertTextToEditor"
    @submit="saveDraft"
    @open-files="showFiles = true"/>
  <!-- // editor -->

  <!-- bottom buttons -->
  <nav-bottom>
    <template slot="left">
      <button-basic type="button" icon-left="arrow-left" @click="$router.back()">Back</button-basic>
    </template>
    <template slot="right">
      <template v-if="type === 'edit'">
        <button-basic
          type="submit"
          color="key"
          :icon-left="processing ? 'loader' : 'check'"
          :rotate-icon="processing"
          :disabled="processing">
          Update Article
        </button-basic>
      </template>
      <template v-else>
        <button-basic
          type="button"
          color="gray"
          :icon-left="processing ? 'loader' : 'save'"
          :rotate-icon="processing"
          :disabled="processing"
          @click="saveDraft">
          Save draft
        </button-basic>
        <button-basic
          type="submit"
          color="key"
          :icon-left="processing ? 'loader' : 'check'"
          :rotate-icon="processing"
          :disabled="processing">
          Publishing Article
        </button-basic>
      </template>
    </template>
  </nav-bottom>
  <!-- // bottom buttons -->

  <files-wrap v-if="showFiles" @close="showFiles = false">
    <files
      init-tab="post"
      :post="{
        module: 'articles',
        target_srl: srl,
        ready: type === 'add',
        thumbnail: thumbnailSetting,
        thumbnailImage: thumbnailImage,
        data: {
          nest: datas.nest,
          article: datas.article,
        },
      }"
      :local="{
        dir: 'articles'
      }"
      :full="true"
      @close="showFiles = false"
      @insert="onInsertFromFiles"
      @update-thumbnail="onUpdateThumbnailFromFiles"/>
  </files-wrap>
</form>
</template>

<script>
import { formData } from '~/libs/forms';
import * as messages from '~/libs/messages';
import * as text from '~/libs/text';
import * as dates from '~/libs/dates';
import * as fieldset from '~/components/form/fieldset';

export default {
  name: 'post-article',
  components: {
    'form-text': () => import('~/components/form/text'),
    'form-select': () => import('~/components/form/select'),
    'form-radio': () => import('~/components/form/radio'),
    'button-basic': () => import('~/components/button/basic'),
    'editor': () => import('~/components/pages/articles/post/editor'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'field-wrap': fieldset.wrap,
    'field': fieldset.field,
    'files': () => import('~/components/files'),
    'files-wrap': () => import('~/components/files/wrap'),
  },
  props: {
    type: { type: String, default: 'add' }, // add,edit
    srl: { type: Number, default: null },
    nest_srl: { type: Number },
    category_srl: { type: [Number,String] },
    page: { type: Number },
    skin: { type: String, default: 'default' },
    datas: {
      type: Object,
      required: true,
      nest: { type: Object, required: true },
      categories: { type: Array, default: [] },
      article: { type: Object },
    },
  },
  data()
  {
    const { datas, nest_srl } = this;
    const { nest, article } = datas;
    return {
      processing: false,
      forms: {
        app_srl: nest ? parseInt(nest.app_srl) : null,
        nest_srl: article ? parseInt(article.nest_srl) : nest_srl,
        category_srl: this.getCategoryInForm(),
        type: article ? (this.getTypeName(article.type) || null) : 'public',
        title: {
          value: article ? article.title : '',
          error: '',
        },
        content: {
          value: (article && article.content) ? article.content : '',
          error: '',
        },
        json: this.getJSON(),
        order: {
          value: article ? article.order : dates.convertDateFormat(null, true),
          error: '',
        },
      },
      editor: {
        start: 0,
        end: 0,
      },
      useThumbnailSizeTool: parseInt(nest.json.useThumbnailSizeTool),
      showFiles: false,
      thumbnailUpdated: false,
      thumbnailImage: null,
      thumbnailPath: (article && article.json && article.json.thumbnail) ? article.json.thumbnail.path : '',
      thumbnailSetting: (article && article.json && article.json.thumbnail) ? article.json.thumbnail : { zoom: .25 },
    };
  },
  methods: {
    /**
     * get json
     *
     * @return {object}
     */
    getJSON()
    {
      return !!this.datas.article ? Object.assign({}, this.datas.article.json) : {};
    },
    getCategoryInForm()
    {
      if (this.type === 'edit' && this.datas.article)
      {
        return this.datas.article.category_srl;
      }
      if (this.category_srl === 'null') return null;
      return this.category_srl || null;
    },
    /**
     * get type name
     *
     * @param {string} type
     * @return {string}
     */
    getTypeName(type)
    {
      switch(type)
      {
        case 'private':
          return 'private';
        case 'ready':
          return 'ready';
        case 'public':
        default:
          return 'public';
      }
    },
    /**
     * on change position in editor
     * 에디터의 선택영역이 변했을때 선택영역의 시작과 끝의 위치값을 업데이트한다.
     *
     * @param {Object} op
     */
    onChangePositionEditor(op)
    {
      this.editor.start = op.start;
      this.editor.end = op.end;
    },
    /**
     * insert keyword in editor
     * 에디터 입력창에 문자를 집어넣는다.
     *
     * @param {string} keyword
     * @param {number} selection
     */
    insertTextToEditor(keyword, selection=undefined)
    {
      if (!keyword) return;
      let content = this.forms.content.value + '';
      let pos = this.editor.start;
      if (pos === 0) keyword = keyword.replace(/^\n/g, '');
      this.forms.content.value = content.substr(0, pos) + keyword + content.substr(pos);
      let lastPosition = this.editor.start + (selection ? selection : keyword.length);
      this.editor.start = lastPosition;
      this.editor.end = lastPosition;
      this.$nextTick(() => {
        this.$refs.editor.changeCursor(lastPosition, lastPosition);
      });
    },
    /**
     * on change order
     * `order`값을 검사한다.
     */
    onChangeOrder()
    {
      if (!dates.checkOrderDate(this.forms.order.value))
      {
        this.forms.order.error = messages.msg.errorOrderFormat;
      }
      else if (this.forms.order.error)
      {
        this.forms.order.error = '';
      }
    },
    /**
     * on insert from files
     *
     * @param {array} paths
     */
    onInsertFromFiles(paths)
    {
      console.log(paths.join('\n\n') + `\n`);
      this.insertTextToEditor(paths.join('\n\n') + `\n`);
      this.showFiles = false;
    },
    /**
     * on update thumbnail from files
     *
     * @param {object} set
     * @param {string} image base64
     */
    onUpdateThumbnailFromFiles(set, image)
    {
      this.thumbnailUpdated = true;
      this.thumbnailImage = image;
      this.thumbnailSetting = set;
    },
    /**
     * save
     * 글을 저장하는 역할을 한다.
     *
     * @param {string} type (ready|publishing)
     * @return {Promise}
     * @throws {Error}
     */
    async save(type)
    {
      let json = Object.assign({}, this.forms.json);

      // check order
      if (!dates.checkOrderDate(this.forms.order.value))
      {
        this.forms.order.error = messages.msg.errorOrderFormat;
        throw new Error('Error check order date');
      }

      // update thumbnail image
      if (this.thumbnailUpdated)
      {
        // 이전 이미지는 삭제한다. 삭제 실패하더라도 넘어간다.
        if (this.thumbnailPath)
        {
          await this.$axios.$post(
            `/files/remove-file/`,
            formData({ path: this.thumbnailPath })
          );
        }
        // 새로운 썸네일 이미지를 업로드한다.
        if (this.thumbnailImage)
        {
          let res_uploadSource = await this.$axios.$post(
            `/files/upload-file/`,
            formData({ sub_dir: 'thumbnail', base64: this.thumbnailImage })
          );
          if (!res_uploadSource.success) throw new Error(res_uploadSource.message || 'Failed file upload.');
          if (!res_uploadSource.data.path) throw new Error('Not found source path');
          // make option
          json.thumbnail = {
            ...this.thumbnailSetting,
            path: res_uploadSource.data.path,
          };
          this.thumbnailSetting = (json && json.thumbnail) ? json.thumbnail : {};
          this.thumbnailUpdated = false;
          this.thumbnailImage = null;
          this.thumbnailPath = res_uploadSource.data.path;
        }
        else
        {
          // 업로드된 이미지가 없으면 값을 비워준다.
          json.thumbnail = {
            zoom: .25,
          };
        }
      }
      else if (this.thumbnailSetting.path)
      {
        json.thumbnail = this.thumbnailSetting;
      }

      // save article
      let res = await this.$axios.$post(
        `/articles/${this.srl}/edit/`,
        formData({
          mode: this.type,
          app_srl: this.forms.app_srl,
          nest_srl: this.forms.nest_srl,
          category_srl: this.forms.category_srl || '',
          type: type === 'publishing' ? this.getTypeName(this.forms.type) : 'ready',
          title: this.forms.title.value || '',
          content: this.forms.content.value || '',
          json: encodeURIComponent(JSON.stringify(json)),
          order: this.forms.order.value,
        })
      );
      if (!res.success) throw new Error(res.message);
    },
    /**
     * 임시 글 저장하기
     */
    async saveDraft()
    {
      if (this.type !== 'add') return;
      if (this.processing) return;
      this.processing = true;
      try
      {
        await this.save('draft');
        this.processing = false;
        this.$toast.add({
          message: `Success save draft article.`,
          color: 'success',
        });
      }
      catch(e)
      {
        this.processing = false;
        if (e.message === messages.error.service) e = null;
        this.$toast.add({
          message: (e.message && typeof e.message === 'string') ? e : `Failed save article.`,
          color: 'error',
        });
      }
    },
    /**
     * 실질적인 글 저장하기
     */
    async publishing()
    {
      const { preference } = this.$store.state;
      try
      {
        this.processing = true;
        if (this.forms.type === 'ready') this.forms.type = 'public';
        await this.save('publishing');
        // redirect
        switch (this.type)
        {
          case 'edit':
          case 'add':
            let params = {};
            if (this.category_srl) params.category = this.category_srl;
            if (this.page && this.page > 1) params.page = this.page;
            await this.$router.push(`../${text.serialize(params, true)}`);
            break;
          default:
            await this.$router.push('/articles/');
            break;
        }
      }
      catch(e)
      {
        if (preference.debug.service) console.error(e);
        this.processing = false;
        this.$toast.add({
          message: `Failed ${this.type} article.`,
          color: 'error',
        });
      }
    },
    submit()
    {
      this.publishing().then();
    },
  },
}
</script>
