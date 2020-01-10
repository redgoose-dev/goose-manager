<template>
<article>
  <header class="page-header">
    <h2>Preview UI</h2>
    <p>컴포넌트 테스트 페이지입니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h3>Toast</h3>
    </header>
    <nav>
      <button-basic type="button" @click="addToast">add toast</button-basic>
    </nav>
  </section>

  <section class="page-section">
    <header>
      <h3>Loading</h3>
      <p>데이터를 로딩하고있을때 사용하는 컴포넌트 입니다.</p>
    </header>
    <div class="example">
      <loading :move="false"/>
    </div>
  </section>
</article>
</template>

<script>
export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'button-basic': () => import('~/components/button/basic'),
    'loading': () => import('~/components/etc/loading'),
  },
  mounted()
  {
    this.$toast.add('Auto add');
  },
  methods: {
    addToast()
    {
      this.$toast.add({
        message: 'add message',
        speed: 200,
        delay: 1000,
        color: 'success'
      });
    },
  },
}
</script>

<style src="./pages.scss" lang="scss" scoped/>
