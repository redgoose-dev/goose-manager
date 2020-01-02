<template>
<article>
  <header class="page-header">
    <h2>Button</h2>
    <p>`button-basic`컴포넌트에 관한 내용을 다룹니다.</p>
  </header>

  <section class="page-section">
    <p><button-basic type="button" label="Button" size="small" icon-right="power"/></p>
    <p><button-basic type="button" label="Button" color="key" icon-left="power"/></p>
    <p><button-basic type="button" label="Button" size="large" color="gray" icon-right="power"/></p>
    <p><button-basic href="/" label="A: Button content"/></p>
    <p><button-basic href="/" icon-right="power" :inline="true"/></p>
    <p>
      <button-basic type="button" label="Power" icon-right="power" :inline="true" size="small"/>
      <button-basic to="/" label="Power" icon-left="power" :inline="true"/>
      <button-basic type="button" label="disabled" icon-right="power" :inline="true" :disabled="true" size="large"/>
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
