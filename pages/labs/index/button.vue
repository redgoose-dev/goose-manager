<template>
<article>
  <header class="page-header">
    <h2>Button</h2>
    <p>`button-basic`컴포넌트에 관한 내용을 다룹니다.</p>
  </header>

  <section class="page-section">
    <p><button-basic type="button" size="small" icon-right="power">Button</button-basic></p>
    <p><button-basic type="button" color="key" icon-left="power">Button</button-basic></p>
    <p><button-basic type="button" size="large" color="gray" icon-right="power">Button</button-basic></p>
    <p><button-basic href="/">A: Button content</button-basic></p>
    <p><button-basic href="/" icon-right="power" :inline="true"/></p>
    <p>
      <button-basic type="button" icon-right="power" :inline="true" size="small">Power</button-basic>
      <button-basic to="/" icon-left="power" :inline="true">Power</button-basic>
      <button-basic type="button" icon-right="power" :inline="true" :disabled="true" size="large">disabled</button-basic>
    </p>
    <p>
      <a href="/">link style</a>
    </p>
  </section>
</article>
</template>

<script>
export default {
  components: {
    'button-basic': () => import('~/components/button/basic'),
  },
}
</script>

<style src="./pages.scss" lang="scss" scoped/>
