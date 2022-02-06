<template>
<article>
  <header class="page-header">
    <h2>Button Basic</h2>
    <p>`button-basic`컴포넌트에 관한 내용을 다룹니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h3>basic</h3>
      <p>기본적으로 사용하는 모습</p>
    </header>
    <div class="example">
      <ButtonBasic>mini</ButtonBasic>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h3>size</h3>
      <p>버튼의 사이즈 모음</p>
    </header>
    <div class="example">
      <div class="rg-row rg-row-gutter-h">
        <div class="rg-col">
          <ButtonBasic type="button" size="mini" icon-right="power">mini</ButtonBasic>
        </div>
        <div class="rg-col">
          <ButtonBasic type="button" size="small">small</ButtonBasic>
        </div>
        <div class="rg-col">
          <ButtonBasic type="button">default</ButtonBasic>
        </div>
        <div class="rg-col">
          <ButtonBasic type="button" size="large">large</ButtonBasic>
        </div>
      </div>
    </div>
  </section>
</article>
</template>

<script setup>
import ButtonBasic from '../../components/button/basic.vue';
</script>

<style src="./common.scss" lang="scss" scoped></style>
