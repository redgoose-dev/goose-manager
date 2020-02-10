<template>
<article class="files-content files-content--post">
  <header class="files-content__header">
    <div @click.stop="">
      <content-button
        type="file"
        label="Upload files"
        color="green"
        icon="upload"
        :disabled="processingUpload || pending"
        :accept="contentProps.acceptFileType"
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
          :disabled="selectedSrls.length <= 0"
          @click="remove(selectedSrls)"/>
      </template>
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
      :context="computedContext"
      @change-selected="onChangeSelected"/>
  </div>
</article>
</template>

<script>
import * as text from '~/libs/text';
import * as object from '~/libs/object';

const defaultParams = {
  order: 'srl',
  sort: 'desc',
  unlimit: 1,
};

export default {
  name: 'content-article',
  components: {
    'button-basic': () => import('~/components/button/basic'),
    'loading': () => import('~/components/etc/loading'),
    'content-button': () => import('./parts/content-button'),
    'thumbnails': () => import('./parts/thumbnails'),
  },
  props: {
    contentProps: { type: Object },
  },
  data()
  {
    const { module } = this.contentProps;
    return {
      // srl, target_srl, module, name, size, type, path, ready, progress
      index: [],
      processingUpload: false,
      selectedSrls: [],
      pending: true,
    };
  },
  computed: {
    computedContext()
    {
      let items = [];
      items.push({ label: '새창으로 열기', click: (e) => this.onClickContextMenu('open-window', e) });
      if (this.contentProps.module === 'articles')
      {
        items.push({ label: '썸네일 이미지로 설정', click: (e) => this.onClickContextMenu('make-thumbnail', e) });
      }
      items.push({ label: '삭제하기', click: (e) => this.onClickContextMenu('remove', e) });
      return items;
    },
  },
  async mounted()
  {
    const { module, target_srl } = this.contentProps;
    let params = {
      ...defaultParams,
      target_srl,
      module,
    };
    try
    {
      this.pending = true;
      let files = await this.$axios.$get(`/files/${text.serialize(params, true)}`);
      files = (files.success) ? files.data.index : [];
      this.index = files.map((o) => {
        return {
          ...o,
          srl: parseInt(o.srl),
          target_srl: parseInt(o.target_srl),
          complete: true,
        };
      });
      this.pending = false;
    }
    catch(e)
    {
      this.index = [];
      this.pending = false;
    }
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
      const { target_srl, module } = this.contentProps;
      const formData = new FormData();
      formData.append('target_srl', target_srl);
      formData.append('module', module);
      formData.append('check', '1');
      formData.append('files', files[n]);
      try
      {
        this.index.unshift({ complete: false, percent: 0 });
        let res = await this.$axios.$post('/files/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress(progressEvent)
          {
            self.index[0].percent = parseInt(Math.round((progressEvent.loaded/progressEvent.total) * 100));
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
          module,
          name: res.data[0].name,
          path: res.data[0].path,
          ready: res.data[0].ready,
          regdate: null,
          size: res.data[0].size,
          srl: res.data[0].srl,
          target_srl,
          type: res.data[0].type,
        };
        this.index = index;
        n++;
        if (files.length > n)
        {
          await this.uploadFile(files , n);
        }
      }
      catch(err)
      {
        if (!this.index[0].complete) this.index.shift();
        throw new Error(err.message);
      }
    },
    async remove(arr)
    {
      const request = async (tree) => {
        let srl = tree[0];
        let key = object.getKey(this.index, 'srl', srl);
        try
        {
          let res = await this.$axios.$post(`/files/${srl}/delete/`);
          if (!res.success)
          {
            throw new Error(`Failed delete file.`);
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
      if (!confirm(`정말 ${arr.length}개 파일을 삭제할까요?`)) return;
      this.$refs.thumbnails.selectAll(false);
      await request(arr);
      this.$refs.thumbnails.resetSelect();
    },
    onClickContextMenu(key, e)
    {
      const { preference, url_api } = this.$store.state;
      const thumbnailKey = parseInt(e.currentTarget.dataset.key);
      const thumbnailSrl = parseInt(e.currentTarget.dataset.srl);
      switch (key)
      {
        case 'open-window':
          window.open(`${url_api}/${this.index[thumbnailKey].path}`);
          break;
        case 'make-thumbnail':
          break;
        case 'remove':
          this.remove([thumbnailSrl]).then();
          break;
      }
    },
    onChangeSelected(arr, paths)
    {
      this.selectedSrls = arr;
      this.$emit('update-selected', this.selectedSrls, paths);
    },
    onClickSelectAll()
    {
      this.$refs.thumbnails.selectAll();
    },
  },
}
</script>

<style src="./content.scss" lang="scss" scoped/>
