<template>
<article
  :class="[
    'files-content',
    'files-content--post',
    full && 'files-content--full',
    (showThumbnailEditor || showPreviewThumbnail) && 'files-content--zero-padding',
    pending && 'files-content--pending',
  ]">
  <thumbnail-editor
    v-if="showThumbnailEditor"
    :item="activeItemForThumbnailEditor"
    :target_srl="target_srl"
    :croppie="croppie"
    :thumbnail="thumbnail"
    :full="full"
    @close="onCloseThumbnailEditor"
    @control-window="$emit('custom-event', 'window', $event)"
    @submit="onSubmitThumbnailEditor"/>
  <preview-thumbnail
    v-else-if="showPreviewThumbnail"
    :path="thumbnail.path"
    :output="thumbnailImage"
    :full="full"
    @control-window="$emit('custom-event', 'window', $event)"
    @close="showPreviewThumbnail = false"/>
  <template v-else>
    <header v-if="!pending" class="files-content__header">
      <div @click.stop="">
        <content-button
          type="file"
          label="Upload files"
          color="green"
          icon="upload"
          :disabled="processingUpload || pending"
          :accept="acceptFileType"
          @change="uploadStart"/>
        <template v-if="index.length">
          <content-button
            type="button"
            label="Select All"
            icon="minus-square"
            @click="onClickSelectAll"/>
          <content-button
            type="button"
            label="Delete"
            color="red"
            icon="trash-2"
            :disabled="selected.length <= 0"
            @click="remove(selected)"/>
        </template>
      </div>
      <div>
        <div v-if="computedUseSizeTool" class="files-content__select-size">
          <label>
            <form-radio v-model="sizeSet" name="sizeSet" value="1*1" size="small" @change="onChangeSizeSet"/>
            <span>1X1</span>
          </label>
          <label>
            <form-radio v-model="sizeSet" name="sizeSet" value="2*1" size="small" @change="onChangeSizeSet"/>
            <span>2X1</span>
          </label>
          <label>
            <form-radio v-model="sizeSet" name="sizeSet" value="1*2" size="small" @change="onChangeSizeSet"/>
            <span>1X2</span>
          </label>
          <label>
            <form-radio v-model="sizeSet" name="sizeSet" value="2*2" size="small" @change="onChangeSizeSet"/>
            <span>2X2</span>
          </label>
        </div>
        <p class="files-content__meta">Count: {{index.length}}/{{limit.count}}</p>
      </div>
    </header>
    <div class="files-content__index">
      <div v-if="pending" class="files-content__pending">
        <loading/>
      </div>
      <thumbnails
        v-else
        ref="thumbnails"
        :index="index"
        :full="full"
        @change-selected="onChangeSelected"/>
    </div>
    <dl v-if="!pending" class="files-content__footer">
      <dt>
        <template v-if="module === 'articles' && index.length">
          <div>
            <button-basic
              type="button"
              :disabled="!thumbnail.srl"
              icon-left="corner-up-left"
              @click.stop="onClickResetThumbnail">
              Reset thumbnail
            </button-basic>
          </div>
          <div>
            <button-basic
              type="button"
              :disabled="!thumbnail.srl"
              icon-left="zoom-in"
              @click.stop="showPreviewThumbnail = true">
              Preview thumbnail
            </button-basic>
          </div>
        </template>
      </dt>
      <dd>
        <div v-if="full">
          <button-basic
            type="button"
            icon-left="x"
            @click.stop="$emit('custom-event', 'close')">
            Close
          </button-basic>
        </div>
        <div>
          <button-basic
            type="button"
            color="key"
            :disabled="selected.length <= 0"
            icon-left="download"
            @click.stop="onClickInsertText">
            Insert
          </button-basic>
        </div>
      </dd>
    </dl>
  </template>
</article>
</template>

<script>
import * as text from '~/libs/text';
import * as object from '~/libs/object';
import { formData } from '~/libs/forms';

export default {
  name: 'content-post',
  components: {
    'loading': () => import('~/components/etc/loading'),
    'button-basic': () => import('~/components/button/basic'),
    'content-button': () => import('./parts/content-button'),
    'thumbnails': () => import('./parts/thumbnails'),
    'thumbnail-editor': () => import('./post/thumbnail-editor'),
    'preview-thumbnail': () => import('./post/preview-thumbnail'),
    'form-radio': () => import('~/components/form/radio'),
  },
  props: {
    ready: { type: Boolean, default: false },
    target_srl: { type: Number },
    module: { type: String, default: 'articles' }, // articles,comments
    acceptFileType: { type: String },
    full: { type: Boolean, default: false },
    nest: { type: Object, default: null },
    article: { type: Object, default: null },
    comment: { type: Object, default: null },
    thumbnail: { type: Object },
    thumbnailImage: { type: String, default: null },
  },
  data()
  {
    return {
      index: [],
      processingUpload: false,
      selected: [],
      pending: true,
      activeItemForThumbnailEditor: null,
      showThumbnailEditor: false,
      showPreviewThumbnail: false,
      limit: {
        count: 10,
        sizeSingle: 5000000,
      },
      croppie: {
        boundary: { width: '100%', height: 750, },
        viewport: { width: 320, height: 240, type: 'square' },
      },
      sizeSet: this.thumbnail.sizeSet || '1*1',
    };
  },
  computed: {
    computedUseSizeTool()
    {
      if (!(this.nest && this.nest.json)) return false;
      return parseInt(this.nest.json.useThumbnailSizeTool) === 1;
    },
  },
  async mounted()
  {
    await this.getPref();
    await this.getItems();
  },
  methods: {
    // 업로드 시작
    async uploadStart(files)
    {
      const { preference } = this.$store.state;
      if (files.length > 0 && !this.processingUpload)
      {
        try
        {
          this.processingUpload = true;
          await this.uploadFile(files, 0);
          this.processingUpload = false;
          this.$refs.thumbnails.resetSelect();
        }
        catch(err)
        {
          this.processingUpload = false;
          this.$toast.add({
            message: preference.debug.service ? err.message : `Failed upload files.`,
            color: 'error',
          });
        }
      }
    },
    // 파일 하나 업로드. 끝나게 되면 다음 파일을 업로드 재귀함수 플레이
    async uploadFile(files, n)
    {
      const self = this;
      try
      {
        if (this.limit.sizeSingle < files[n].size)
        {
          throw new Error('파일 용량을 초과했습니다.');
        }
        if (this.index.length >= (this.limit.count || 20))
        {
          throw new Error('파일 업로드 갯수를 초과했습니다.');
        }
        this.index.unshift({ complete: false, percent: 0 });
        let res = await this.$axios.$post(
          '/files/',
          formData({
            target_srl: this.target_srl,
            module: this.module,
            check: '1',
            files: files[n],
          }),
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress(progressEvent)
            {
              self.index[0].percent = Math.round((progressEvent.loaded/progressEvent.total) * 100);
            },
          });
        if (!res.success) throw new Error(res.message);
        if (res.data[0].status === 'error')
        {
          throw new Error(res.data[0].message);
        }
        let index = Object.assign([], this.index);
        index[0] = {
          complete: true,
          module: this.module,
          target_srl: this.target_srl,
          name: res.data[0].name,
          path: res.data[0].path,
          ready: res.data[0].ready,
          regdate: null,
          size: res.data[0].size,
          srl: res.data[0].srl,
          type: res.data[0].type,
          badge: [],
          context: this.setContextMenuInThumbnail(res.data[0]),
        };
        this.index = index;
        n++;
        if (files.length > n) await this.uploadFile(files , n);
      }
      catch(err)
      {
        if (!this.index[0].complete) this.index.shift();
        throw new Error(err.message);
      }
    },
    // 파일 삭제하기
    async remove(arr)
    {
      const request = async (tree) => {
        let srl = tree[0].srl;
        let key = object.getKey(this.index, 'srl', srl);
        try
        {
          let res = await this.$axios.$post(`/files/${srl}/delete/`);
          if (!res.success)
          {
            throw new Error(`Failed remove file.`);
          }
          this.index.splice(key, 1);
          tree.shift();
          if (tree.length) await request(tree);
        }
        catch(err)
        {
          this.$toast.add({ message: err.message, color: 'error' });
          return;
        }
      };
      if (!(arr && arr.length > 0)) return;
      if (!confirm(`${arr.length}개 파일을 정말 삭제할까요?`)) return;
      this.$refs.thumbnails.selectAll(false);
      await request(arr);
      this.$refs.thumbnails.resetSelect();
    },
    // 이미지 컨텐스트 메뉴를 선택했을때의 이벤트
    onClickContextMenu(type, e)
    {
      const { url_api } = this.$store.state;
      const key = parseInt(e.currentTarget.dataset.key);
      switch (type)
      {
        case 'open-window':
          window.open(`${url_api}/${this.index[key].path}`);
          break;
        case 'make-thumbnail':
          this.activeItemForThumbnailEditor = this.index[key];
          this.showThumbnailEditor = true;
          break;
        case 'remove':
          this.remove([this.index[key]]).then();
          break;
      }
    },
    // 이미지 선택이 변했을때
    onChangeSelected(arr)
    {
      this.selected = arr;
      this.$emit('update-selected', arr);
    },
    // 모두 선택하기
    onClickSelectAll()
    {
      this.$refs.thumbnails.selectAll();
    },
    // article,nest 가져오기
    async getPref()
    {
      let article = null;
      let comment = null;
      let nest = null;
      switch (this.module)
      {
        case 'articles':
          // get article
          if (!(this.article && this.nest))
          {
            let params = this.ready ? '?visible_type=ready' : '';
            article = await this.$axios.$get(`/${this.module}/${this.target_srl}/${params}`);
            if (!article.success) return;
            this.article = article.data;
            // get nest
            nest = await this.$axios.$get(`/nests/${this.article.nest_srl}/`);
            if (!nest.success) return;
            this.nest = nest.data;
          }
          // get values
          this.limit.count = this.nest.json.files.count;
          this.limit.sizeSingle = this.nest.json.files.sizeSingle;
          if (this.nest.json.useThumbnailSizeTool === '1')
          {
            this.onChangeSizeSet(this.sizeSet);
          }
          else
          {
            this.croppie.viewport.width = this.nest.json.thumbnail.width;
            this.croppie.viewport.height = this.nest.json.thumbnail.height;
          }
          break;
        case 'comments':
          // get comment
          comment = await this.$axios.$get(`/${this.module}/${this.target_srl}/`);
          if (!comment.success) return;
          comment = comment.data;
          // get article
          article = await this.$axios.$get(`/articles/${comment.article_srl}/`);
          if (!article.success) return;
          article = article.data;
          // get nest
          nest = await this.$axios.$get(`/nests/${article.nest_srl}/`);
          if (!nest.success) return;
          nest = nest.data;
          // set values
          this.limit.count = nest.json.files.count;
          this.limit.sizeSingle = nest.json.files.sizeSingle;
          break;
      }
    },
    // 이미지 가져오기
    async getItems()
    {
      this.pending = true;
      let params = {
        order: 'srl',
        sort: 'desc',
        unlimit: 1,
        target: this.target_srl,
        module: this.module,
      };
      try
      {
        let files = await this.$axios.$get(`/files/${text.serialize(params, true)}`);
        if (files.success)
        {
          files = files.data.index;
          this.index = files.map((o) => {
            let badge = [];
            if (this.thumbnail.srl === parseInt(o.srl)) badge.push('image');
            return {
              ...o,
              complete: true,
              srl: parseInt(o.srl),
              target_srl: parseInt(o.target_srl),
              badge,
              context: this.setContextMenuInThumbnail(o),
            };
          });
          this.pending = false;
        }
        else
        {
          throw new Error(files.message);
        }
      }
      catch(e)
      {
        this.index = [];
        this.pending = false;
      }
    },
    // 이미지 컨텍스트 메뉴 설정
    setContextMenuInThumbnail(item)
    {
      let items = [];
      items.push({ label: '새창으로 열기', click: (e) => this.onClickContextMenu('open-window', e) });
      if (this.module === 'articles' && /^image/.test(item.type))
      {
        items.push({ label: '썸네일 이미지로 설정', click: (e) => this.onClickContextMenu('make-thumbnail', e) });
      }
      items.push({ label: '삭제하기', color: 'red', click: (e) => this.onClickContextMenu('remove', e) });
      return items;
    },
    // `삽입`버튼 클릭 이벤트
    onClickInsertText()
    {
      this.$emit('custom-event', 'insert-text', Object.assign([], this.selected));
    },
    // 썸네일 에디터 닫기
    onCloseThumbnailEditor()
    {
      this.activeItemForThumbnailEditor = null;
      this.showThumbnailEditor = false;
    },
    // 썸네일 에디터 submit
    onSubmitThumbnailEditor(set, image)
    {
      this.$emit('custom-event', 'update-thumbnail-editor', {
        ...set,
        sizeSet: this.sizeSet,
      }, image);
      this.activeItemForThumbnailEditor = null;
      this.showThumbnailEditor = false;
      let index = Object.assign([], this.index);
      this.index = index.map((o) => {
        let result = Object.assign({}, o);
        let idx = o.badge.indexOf('image');
        if (idx > -1) result.badge.splice(idx, 1);
        if (o.srl === set.srl) result.badge.push('image');
        return result;
      });
      this.$nextTick(() => {
        this.$refs.thumbnails.onClickBackground();
      });
    },
    // 썸네일 이미지 리셋
    onClickResetThumbnail()
    {
      this.$emit(
        'custom-event',
        'update-thumbnail-editor',
        { zoom: .25, path: null, srl: null, points: null, sizeSet: null },
        null);
      let index = Object.assign([], this.index);
      this.index = index.map((o) => {
        let result = Object.assign({}, o);
        let idx = o.badge.indexOf('image');
        if (idx > -1) result.badge.splice(idx, 1);
        return result;
      });
    },
    closeSubWindow(code)
    {
      switch (code)
      {
        case 'preview-thumbnail':
          this.showPreviewThumbnail = false;
          break;
        case 'thumbnail-editor':
          this.showThumbnailEditor = false;
          break;
      }
    },
    onChangeSizeSet(size)
    {
      if (!size) size = '1*1';
      size = size.split('*');
      let width = this.nest.json.thumbnail.width || 320;
      let height = this.nest.json.thumbnail.height || 240;
      this.croppie.viewport.width = width * parseInt(size[0]);
      this.croppie.viewport.height = height * parseInt(size[1]);
    },
  },
}
</script>

<style src="./content.scss" lang="scss" scoped/>
