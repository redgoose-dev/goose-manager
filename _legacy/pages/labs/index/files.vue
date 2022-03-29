<template>
<article>
  <header class="page-header">
    <h2>Form components</h2>
    <p>파일첨부관리 라이브러리입니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h3>basic</h3>
      <p>기본적으로 사용하는 방식</p>
    </header>
    <div class="example">
      <files
        init-tab="post"
        init-external=""
        :post="{
          module: module, // articles,comments
          target_srl: target_srl,
          ready: false,
          thumbnail: thumbnailSetting,
          thumbnailImage: thumbnailImage,
          data: {
            nest: null,
            article: null,
          },
        }"
        :local="{ dir: 'dev' }"
        :external="{}"
        accept-file-type="image/*,.pdf"
        @insert="onInsert"
        @update-thumbnail="onUpdateThumbnail"/>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h3>modal</h3>
      <p>버튼을 눌러 팝업 형태로 띄우는 방식</p>
      <div class="example">
        <button-basic :inline="true" color="key" @click="visibleFiles = true">Open files</button-basic>
        <files-wrap v-if="visibleFiles" @close="visibleFiles = false">
          <files
            init-tab="post"
            :post="{
              module: module, // articles,comments
              target_srl: target_srl,
              ready: false,
              thumbnail: thumbnailSetting,
              thumbnailImage: thumbnailImage,
              data: {
                nest: null,
                article: null,
                comment: null,
              },
            }"
            :local="{ dir: 'dev' }"
            :full="true"
            @insert="onInsert"
            @close="visibleFiles = false"
            @update-thumbnail="onUpdateThumbnail"/>
        </files-wrap>
      </div>
    </header>
  </section>
</article>
</template>

<script>
import * as forms from "@/libs/forms";
import { formData } from "@/libs/forms";

export default {
  name: 'labs-page-files',
  components: {
    'files': () => import('~/components/files'),
    'files-wrap': () => import('~/components/files/wrap'),
    'button-basic': () => import('~/components/button/basic'),
  },
  data()
  {
    return {
      target_srl: 33,
      module: 'articles', // articles,comments
      visibleFiles: false,
      article: null,
      thumbnailPath: null,
      thumbnailImage: null,
      thumbnailSetting: {
        zoom: .25,
      },
    };
  },
  async mounted()
  {
    try
    {
      if (!this.target_srl) throw new Error('no target_srl');
      let article = await this.$axios.$get(`/${this.module}/${this.target_srl}/`);
      if (!article.success) throw new Error(article.message);
      this.article = article.data;
      this.thumbnailSetting = this.article.json.thumbnail;
      this.thumbnailPath = this.article.json.thumbnail.path;
    }
    catch(e)
    {
      console.error(e.message);
    }
  },
  methods: {
    onInsert()
    {
      this.visibleFiles = false;
    },
    async onUpdateThumbnail(set, image)
    {
      if (!this.article)
      {
        this.$toast.add({
          message: 'Not found article',
          color: 'error',
        });
        return;
      }
      this.thumbnailSetting = set;
      try
      {
        // remove current thumbnail image
        if (this.thumbnailPath)
        {
          await this.$axios.$post(
            `/files/remove-file/`,
            forms.formData({ path: this.thumbnailPath })
          );
        }

        // upload new thumbnail image
        let res_uploadFile = null;
        if (image)
        {
          res_uploadFile = await this.$axios.$post(
            `/files/upload-file/`,
            formData({
              sub_dir: 'thumbnail',
              base64: image,
            })
          );
          if (!res_uploadFile.success) throw new Error(res_uploadFile.message || 'Failed file upload.');
          if (!res_uploadFile.data.path) throw new Error('not found source path');
          this.thumbnailSetting.path = res_uploadFile.data.path;
          this.thumbnailPath = res_uploadFile.data.path;
        }

        // update article
        let newThumbnail = {
          ...((this.article.json && this.article.json.thumbnail) ? this.article.json.thumbnail : {}),
          srl: set.srl,
          path: res_uploadFile ? res_uploadFile.data.path : null,
          points: set.points,
          zoom: set.zoom,
        };
        let res_edit = await this.$axios.$post(
          `/${this.module}/${this.target_srl}/edit/`,
          forms.formData({
            json: encodeURIComponent(JSON.stringify({ thumbnail: newThumbnail })),
          })
        );
        if (!res_edit.success) throw new Error(res_edit.message);
      }
      catch(e)
      {
        console.error(e);
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed submit thumbnail editor.`,
          color: 'error',
        });
      }
    },
  },
}
</script>

<style src="./pages.scss" lang="scss" scoped/>
