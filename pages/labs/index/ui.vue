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
</article>
</template>

<script>
export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'button-basic': () => import('~/components/button/basic'),
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
