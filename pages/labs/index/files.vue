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
import {formData} from "@/libs/forms";

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
      target_srl: 9,
      module: 'articles', // articles,comments
      visibleFiles: false,
    };
  },
  methods: {
    onInsert(paths)
    {
      console.log('onInsert', paths);
      this.visibleFiles = false;
    },
    async onUpdateThumbnail(set)
    {
      const { thumbnail, output } = set;

      // get article
      let article = await this.$axios.$get(`/${this.module}/${this.target_srl}/`);
      if (!article.success) throw new Error(article.message);
      article = article.data;

      try
      {
        // remove current thumbnail image
        if (article.json && article.json.thumbnail.path)
        {
          await this.$axios.$post(
            `/files/remove-file/`,
            forms.formData({ path: article.json.thumbnail.path })
          );
        }

        // upload new thumbnail image
        let res_uploadFile = await this.$axios.$post(
          `/files/upload-file/`,
          formData({
            sub_dir: 'thumbnail',
            base64: output,
          })
        );
        if (!res_uploadFile.success) throw new Error(res_uploadFile.message || 'Failed file upload.');
        if (!res_uploadFile.data.path) throw new Error('not found source path');

        // update article
        let newThumbnail = {
          ...((article.json && article.json.thumbnail) ? article.json.thumbnail : {}),
          srl: thumbnail.srl,
          path: res_uploadFile.data.path,
          points: thumbnail.points,
          zoom: thumbnail.zoom,
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
