<template>
<article>
  <header class="page-header">
    <h1>Button Basic</h1>
    <p>`button-basic`컴포넌트에 관한 내용을 다룹니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h2>basic</h2>
      <p>기본적으로 사용하는 모습</p>
    </header>
    <div class="example">
      <ButtonBasic>Button Component</ButtonBasic>
    </div>

    <header>
      <h2>size</h2>
      <p>버튼의 사이즈 모음</p>
    </header>
    <div class="example">
      <div class="grid grid--col-2">
        <div>
          <ButtonBasic type="button" size="small">small</ButtonBasic>
        </div>
        <div>
          <ButtonBasic type="button">default</ButtonBasic>
        </div>
      </div>
    </div>

    <header>
      <h2>color</h2>
      <p>버톤의 컬러</p>
    </header>
    <div class="example">
      <div class="grid grid--col-3">
        <div>
          <ButtonBasic type="button">default</ButtonBasic>
        </div>
        <div>
          <ButtonBasic type="button" color="key">key</ButtonBasic>
        </div>
        <div>
          <ButtonBasic type="button" color="sub">sub</ButtonBasic>
        </div>
        <div>
          <ButtonBasic type="button" color="error">error</ButtonBasic>
        </div>
        <div>
          <ButtonBasic type="button" color="weak">weak</ButtonBasic>
        </div>
      </div>
    </div>

    <header>
      <h2>element type</h2>
      <p>다양한 엘리먼트 사용</p>
    </header>
    <div class="example">
      <div class="grid grid--col-3">
        <div>
          <ButtonBasic href="https://google.com" target="_blank">a:href</ButtonBasic>
        </div>
        <div>
          <ButtonBasic href="#">nuxt-link</ButtonBasic>
        </div>
        <div>
          <ButtonBasic type="button">type=button</ButtonBasic>
        </div>
      </div>
    </div>

    <header>
      <h2>with icon</h2>
      <p>아이콘 사용하기</p>
    </header>
    <div class="example">
      <div class="grid grid--col-4">
        <div>
          <ButtonBasic type="button" icon-right="power"/>
        </div>
        <div>
          <ButtonBasic type="button" icon-left="check">left icon</ButtonBasic>
        </div>
        <div>
          <ButtonBasic type="button" icon-right="check">right icon</ButtonBasic>
        </div>
        <div>
          <ButtonBasic type="button" icon-right="loader" :rotate-icon="true"/>
        </div>
      </div>
    </div>

    <header>
      <h2>inline</h2>
      <p>인라인 버튼</p>
    </header>
    <div class="example">
      <ButtonBasic type="button" :inline="true">button</ButtonBasic>
    </div>

    <header>
      <h2>disabled</h2>
      <p>버튼 비활성화</p>
    </header>
    <div class="example">
      <ButtonBasic type="button" :disabled="true">button</ButtonBasic>
    </div>
  </section>

  <hr class="page-section-line">

  <header class="page-header">
    <h1>Button Icon</h1>
    <p>`button-icon`컴포넌트에 관한 내용을 다룹니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h2>type</h2>
      <p>사용 용도에 따른 타입</p>
    </header>
    <div class="example">
      <div class="flex">
        <ButtonIcon icon-name="menu"/>
        <ButtonIcon icon-name="activity" href="/foo/"/>
        <ButtonIcon icon-name="twitter" href="https://google.com"/>
        <ButtonIcon icon-name="star" color="key"/>
        <ButtonIcon icon-name="cast" color="sub"/>
        <ButtonIcon icon-name="file-minus" color="error"/>
        <ButtonIcon icon-name="cloud" color="weak"/>
      </div>
    </div>
    <header>
      <h2>disabled</h2>
    </header>
    <div class="example">
      <div class="flex">
        <ButtonIcon icon-name="github" :disabled="true"/>
      </div>
    </div>
  </section>
</article>
</template>

<script lang="ts" setup>
import { ButtonBasic } from '../../components/button'
import ButtonIcon from '../../components/button/icon.vue'
</script>

<style src="./common.scss" lang="scss" scoped></style>
