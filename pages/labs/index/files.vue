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
        module="articles"
        :target_srl="9"
        accept-file-type="image/*,.pdf"
        local-dir="assets"
        @insert="onInsert"/>
    </div>
  </section>
</article>
</template>

<script>
export default {
  name: 'labs-page-files',
  components: {
    'files': () => import('~/components/files'),
  },
  data()
  {
    return {};
  },
  methods: {
    onInsert(paths)
    {
      console.log('onInsert', paths);
    },
  },
}
</script>

<style src="./pages.scss" lang="scss" scoped/>
