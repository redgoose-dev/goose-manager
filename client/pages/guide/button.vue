<template>
<article>
  <header class="page-header">
    <h1>Button Basic</h1>
    <p>`button-basic`컴포넌트에 관한 내용을 다룹니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h1>basic</h1>
      <p>기본적으로 사용하는 모습</p>
    </header>
    <div class="example">
      <ButtonBasic>Button Component</ButtonBasic>
    </div>

    <header>
      <h1>disabled</h1>
      <p>버튼 비활성화</p>
    </header>
    <div class="example">
      <ButtonBasic type="button" :disabled="true">button</ButtonBasic>
    </div>

    <header>
      <h1>size</h1>
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
      <h1>color</h1>
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
          <ButtonBasic type="button" color="code">code</ButtonBasic>
        </div>
        <div>
          <ButtonBasic type="button" color="success">success</ButtonBasic>
        </div>
        <div>
          <ButtonBasic type="button" color="error">error</ButtonBasic>
        </div>
      </div>
    </div>

    <header>
      <h1>element type</h1>
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
      <h1>with icon</h1>
      <p>아이콘 사용하기</p>
    </header>
    <div class="example">
      <div class="grid grid--col-4">
        <div>
          <ButtonBasic type="button" icon-right="power"/>
        </div>
        <div>
          <ButtonBasic type="button" icon-left="chevrons-left">left icon</ButtonBasic>
        </div>
        <div>
          <ButtonBasic type="button" icon-right="chevrons-right">right icon</ButtonBasic>
        </div>
        <div>
          <ButtonBasic type="button" icon-right="loader" :rotate-icon="true"/>
        </div>
        <div>
          <ButtonBasic type="button" icon-left="cloud" size="small">Small size</ButtonBasic>
        </div>
      </div>
    </div>

    <header>
      <h1>inline</h1>
      <p>인라인 버튼</p>
    </header>
    <div class="example">
      <ButtonBasic type="button" :inline="true">button</ButtonBasic>
    </div>

    <header>
      <h1>group</h1>
      <p>여러개의 버튼그룹</p>
    </header>
    <div class="example">
      <ButtonGroup>
        <ButtonBasic>First</ButtonBasic>
        <ButtonBasic color="key">Button Component</ButtonBasic>
        <ButtonBasic color="sub">Last</ButtonBasic>
      </ButtonGroup>
    </div>
  </section>

  <hr class="page-section-line">

  <header class="page-header">
    <h1>Button Icon</h1>
    <p>`button-icon`컴포넌트에 관한 내용을 다룹니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h1>type</h1>
      <p>사용 용도에 따른 타입</p>
    </header>
    <div class="example">
      <div class="flex">
        <ButtonIcon icon-name="box"/>
        <ButtonIcon icon-name="code" href="/foo/"/>
        <ButtonIcon icon-name="link" href="https://google.com"/>
      </div>
    </div>
    <header>
      <h1>colors</h1>
      <p>아이콘 사용하기</p>
    </header>
    <div class="example">
      <div class="flex">
        <ButtonIcon icon-name="cloud" color="key"/>
        <ButtonIcon icon-name="star" color="sub"/>
        <ButtonIcon icon-name="trash-2" color="code"/>
        <ButtonIcon icon-name="settings" color="success"/>
        <ButtonIcon icon-name="power" color="error"/>
      </div>
    </div>
    <header>
      <h1>size</h1>
    </header>
    <div class="example">
      <div class="flex">
        <ButtonIcon icon-name="droplet"/>
        <ButtonIcon icon-name="server" size="small"/>
      </div>
    </div>
    <header>
      <h1>disabled</h1>
    </header>
    <div class="example">
      <div class="flex">
        <ButtonIcon icon-name="user" :disabled="true"/>
      </div>
    </div>
  </section>
</article>
</template>

<script setup>
import { ButtonBasic, ButtonGroup, ButtonIcon } from '../../components/button/index.js'
</script>

<style src="./common.scss" lang="scss" scoped></style>
