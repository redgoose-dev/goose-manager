<template>
<article>
  <header class="page-header">
    <h2>Button</h2>
    <p>`button-basic`컴포넌트에 관한 내용을 다룹니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h3>size</h3>
      <p>버튼의 사이즈 모음</p>
    </header>
    <div class="example">
      <div class="rg-row rg-row-gutter-h">
        <div class="rg-col">
          <button-basic type="button" size="small">small</button-basic>
        </div>
        <div class="rg-col">
          <button-basic type="button">default</button-basic>
        </div>
        <div class="rg-col">
          <button-basic type="button" size="large">large</button-basic>
        </div>
      </div>
    </div>

    <header>
      <h3>color</h3>
      <p>버톤의 컬러</p>
    </header>
    <div class="example">
      <div class="rg-row rg-row-v-center rg-row-gutter-h">
        <div class="rg-col">
          <button-basic type="button">default</button-basic>
        </div>
        <div class="rg-col">
          <button-basic type="button" color="gray">gray</button-basic>
        </div>
        <div class="rg-col">
          <button-basic type="button" color="key">key</button-basic>
        </div>
      </div>
    </div>

    <header>
      <h3>element type</h3>
      <p>다양한 엘리먼트 사용</p>
    </header>
    <div class="example">
      <div class="rg-row rg-row-v-center rg-row-gutter-h">
        <div class="rg-col">
          <button-basic href="https://google.com" target="_blank">a:href</button-basic>
        </div>
        <div class="rg-col">
          <button-basic to="#">nuxt-link</button-basic>
        </div>
        <div class="rg-col">
          <button-basic type="button">type=button</button-basic>
        </div>
      </div>
    </div>

    <header>
      <h3>with icon</h3>
      <p>아이콘 사용하기</p>
    </header>
    <div class="example">
      <div class="rg-row rg-row-v-center rg-row-gutter-h">
        <div class="rg-col">
          <button-basic type="button" icon-right="power"/>
        </div>
        <div class="rg-col">
          <button-basic type="button" icon-left="check">left icon</button-basic>
        </div>
        <div class="rg-col">
          <button-basic type="button" icon-right="check">right icon</button-basic>
        </div>
        <div class="rg-col">
          <button-basic type="button" icon-right="loader" :rotate-icon="true"/>
        </div>
      </div>
    </div>

    <header>
      <h3>inline</h3>
      <p>인라인 버튼</p>
    </header>
    <div class="example">
      <button-basic type="button" :inline="true">button</button-basic>
    </div>

    <header>
      <h3>disabled</h3>
      <p>버튼 비활성화</p>
    </header>
    <div class="example">
      <button-basic type="button" :disabled="true">button</button-basic>
    </div>
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
