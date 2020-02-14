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
          module, // articles,comments
          target_srl,
        }"
        :local="{ dir: 'dev' }"
        :external="{}"
        accept-file-type="image/*,.pdf"
        @insert="onInsert"/>
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
              module, // articles,comments
              target_srl,
            }"
            :local="{ dir: 'dev' }"
            :full="true"
            @insert="onInsert"
            @close="visibleFiles = false"/>
        </files-wrap>
      </div>
    </header>
  </section>
</article>
</template>

<script>
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
  },
}
</script>

<style src="./pages.scss" lang="scss" scoped/>
