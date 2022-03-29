<template>
<article>
  <header class="page-header">
    <h2>Modal components</h2>
    <p>레이어 팝업창 컴포넌트</p>
  </header>

  <section class="page-section">
    <header>
      <h3>basic</h3>
      <p>기본적인 형태로 사용됩니다.</p>
      <pre><code>'modal-basic': () => import('~/components/modal/basic'),</code></pre>
    </header>
    <div class="example">
      <button-basic type="button" color="key" @click="basic = true">
        open modal
      </button-basic>
    </div>
  </section>

  <modal-basic
    :visible="basic"
    :center="true"
    @close="basic = false">
    <div>fooo</div>
  </modal-basic>
</article>
</template>

<script>
export default {
  components: {
    'modal-basic': () => import('~/components/modal/basic'),
    'button-basic': () => import('~/components/button/basic'),
  },
  data()
  {
    return {
      basic: false,
    };
  },
}
</script>

<style src="./pages.scss" lang="scss" scoped/>
<style lang="scss" scoped>
//
</style>
