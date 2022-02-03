<template>
<article :class="[
  'files-content',
  'files-content--local',
  full && 'files-content--full',
]">
  <header class="files-content__header">
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
      <p class="files-content__meta">
        Count: {{index.length}}
      </p>
    </div>
  </header>
  <div ref="thumbnailsWrap" :class="['files-content__index', dragOver && 'over']">
    <div v-if="pending" class="files-content__pending">
      <loading/>
    </div>
    <div v-else class="files-content__thumbnails">
      <thumbnails
        ref="thumbnails"
        :index="index"
        :full="full"
        @change-selected="onChangeSelected"
        @mounted="initDragAndDropEvent"/>
    </div>
  </div>
  <dl class="files-content__footer">
    <dt></dt>
    <dd>
      <div :class="[
        'footer-nav-dropdown',
        'nav-item',
        selected.length <= 0 && 'footer-nav-dropdown--disabled',
      ]">
        <button-basic
          type="button"
          :disabled="selected.length <= 0"
          icon-left="download"
          color="key"
          @click.stop="onClickInsertText">
          Insert Image
        </button-basic>
        <div class="footer-nav-dropdown__context">
          <ul>
            <li>
              <button type="button" @click.stop="onClickInsertAddress">
                Insert address
              </button>
            </li>
            <li>
              <button type="button" @click.stop="onClickInsertHtml">
                Insert html
              </button>
            </li>
            <li>
              <button type="button" @click.stop="onClickInsertText">
                Insert text
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="full" class="nav-item">
        <button-basic
          type="button"
          icon-left="x"
          @click.stop="$emit('custom-event', 'close')">
          Close
        </button-basic>
      </div>
    </dd>
  </dl>
</article>
</template>

<script>
import * as text from "~/libs/text";
import * as object from "~/libs/object";
import { formData } from '~/libs/forms';

export default {
  name: 'content-local',
  components: {
    'button-basic': () => import('~/components/button/basic'),
    'loading': () => import('~/components/etc/loading'),
    'content-button': () => import('./parts/content-button'),
    'thumbnails': () => import('./parts/thumbnails'),
  },
  props: {
    acceptFileType: { type: String },
    dir: { type: String, default: null },
    full: { type: Boolean, default: false },
  },
  data()
  {
    return {
      index: [],
      processingUpload: false,
      selected: [],
      pending: true,
      count_srl: 0,
      dragOver: false,
    };
  },
  created()
  {
    this.$thumbnailsWrap = null;
  },
  async mounted()
  {
    let params = { order: 'date', sort: 'desc' };
    try
    {
      this.pending = true;
      let url = `/files/get-files/${this.dir}/${text.serialize(params, true)}`;
      let files = await this.$axios.$get(url);
      files = (files.success) ? files.data.index : [];
      this.count_srl = files.length;
      this.index = files.map((o,k) => {
        return {
          ...o,
          complete: true,
          srl: files.length - (k + 1),
          badge: [],
          context: this.setContextMenuInThumbnail(o),
        };
      });
      this.pending = false;
    }
    catch(e)
    {
      this.pending = false;
    }
  },
  destroyed()
  {
    this.initDragAndDropEvent(true);
  },
  methods: {
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
    async uploadFile(files, n)
    {
      const self = this;
      let idx = null;
      try
      {
        idx = this.index.push({ complete: false, percent: 0 });
        idx = idx - 1;
        let res = await this.$axios.$post(
          `/files/upload-file/`,
          formData({ sub_dir: this.dir, file: files[n] }),
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress(progressEvent)
            {
              self.index[idx].percent = Math.round((progressEvent.loaded/progressEvent.total) * 100);
            },
          });
        if (!res.success) throw new Error(res.message);
        let index = Object.assign([], this.index);
        index[idx] = {
          complete: true,
          srl: this.count_srl,
          name: res.data.name,
          path: res.data.path,
          pathFull: res.data.pathFull,
          size: res.data.size,
          type: res.data.type,
          badge: [],
          context: this.setContextMenuInThumbnail(res.data),
        };
        this.index = index;
        n++;
        this.count_srl = this.count_srl + 1;
        if (files.length > n) await this.uploadFile(files , n);
      }
      catch(err)
      {
        if (!this.index[idx].complete) this.index.pop();
        throw new Error(err.message);
      }
    },
    async remove(arr)
    {
      const request = async (tree) => {
        let srl = tree[0].srl;
        let key = object.getKey(this.index, 'srl', srl);
        try
        {
          let res = await this.$axios.$post(
            `/files/remove-file/`,
            formData({ path: tree[0].path })
          );
          if (!res.success) throw new Error(`Failed remove file.`);
          this.index.splice(key, 1);
          tree.shift();
          if (tree.length) await request(tree);
        }
        catch(err)
        {
          this.$toast.add({ message: err.message, color: 'error' });
        }
      };
      if (!(arr && arr.length > 0)) return;
      if (!confirm(`${arr.length}개 파일을 정말 삭제할까요?`)) return;
      this.$refs.thumbnails.selectAll(false);
      await request(arr);
      this.$refs.thumbnails.resetSelect();
    },
    onClickContextMenu(type, e)
    {
      const { url_api } = this.$store.state;
      let key = null;
      switch (type)
      {
        case 'open-window':
          key = parseInt(e.currentTarget.dataset.key);
          window.open(`${url_api}/${this.index[key].path}`);
          break;
        case 'remove':
          key = parseInt(e.currentTarget.dataset.key);
          this.remove([this.index[key]]).then();
          break;
        case 'insert-item':
          this.$emit('custom-event', 'insert-text', [e]);
          break;
        case 'insert-item-html':
          this.$emit('custom-event', 'insert-html', [e]);
          break;
        case 'insert-item-address':
          this.$emit('custom-event', 'insert-address', [e]);
          break;
      }
    },
    onChangeSelected(arr)
    {
      this.selected = arr;
      this.$emit('update-selected', arr);
    },
    onClickSelectAll()
    {
      this.$refs.thumbnails.selectAll();
    },
    setContextMenuInThumbnail(item)
    {
      return [
        { label: '새창으로 열기', click: e => this.onClickContextMenu('open-window', e) },
        { label: '삽입하기', click: () => this.onClickContextMenu('insert-item', item) },
        { label: 'html 삽입하기', click: () => this.onClickContextMenu('insert-item-html', item) },
        { label: '주소 삽입하기', click: () => this.onClickContextMenu('insert-item-address', item) },
        { label: '삭제하기', color: 'red', click: (e) => this.onClickContextMenu('remove', e) },
      ];
    },
    // `삽입`버튼 클릭 이벤트
    onClickInsertText()
    {
      this.$emit('custom-event', 'insert-text', Object.assign([], this.selected));
    },
    onClickInsertHtml()
    {
      this.$emit('custom-event', 'insert-html', Object.assign([], this.selected));
    },
    onClickInsertAddress()
    {
      this.$emit('custom-event', 'insert-address', Object.assign([], this.selected));
    },
    initDragAndDropEvent(remove)
    {
      const onOverFiles = (e) => {
        e.preventDefault();
        if (this.dragOver) return;
        this.dragOver = true;
      };
      const onLeaveFiles = (e) => {
        e.preventDefault();
        this.dragOver = false;
      };
      const onDropFiles = (e) => {
        e.preventDefault();
        this.dragOver = false;
        const files = (e.dataTransfer) ? e.dataTransfer.files : null;
        if (files && files.length) this.uploadStart(files).then();
      };

      if (remove)
      {
        this.$thumbnailsWrap.removeEventListener('dragover', onOverFiles, false);
        this.$thumbnailsWrap.removeEventListener('dragleave', onLeaveFiles, false);
        this.$thumbnailsWrap.removeEventListener('drop', onDropFiles, false);
      }
      else
      {
        if (!window.File || !window.FileList || !window.FileReader || !window.Blob) return;
        this.$thumbnailsWrap = this.$refs.thumbnailsWrap;
        this.$thumbnailsWrap.addEventListener('dragover', onOverFiles, false);
        this.$thumbnailsWrap.addEventListener('dragleave', onLeaveFiles, false);
        this.$thumbnailsWrap.addEventListener('drop', onDropFiles, false);
      }
    },
  },
}
</script>

<style src="./content.scss" lang="scss" scoped/>
