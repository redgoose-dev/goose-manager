<template>
<article>
  <header class="page-header">
    <h1>File manager</h1>
    <p>파일첨부관리 라이브러리입니다.</p>
  </header>

  <section>
    <header>
      <h2>basic</h2>
      <p>기본적으로 사용하는 방식</p>
    </header>
    <div class="example">
      TODO: 만들어넣을 예정
    </div>
  </section>

  <section>
    <header>
      <h2>modal</h2>
      <p>버튼을 눌러 팝업 형태로 띄우는 방식</p>
    </header>
    <div class="example">
      <nav class="flex flex--h-center">
        <div>
          <ButtonBasic color="key" @click="showFileManager = true">
            Open file manager
          </ButtonBasic>
        </div>
      </nav>
    </div>
  </section>

  <teleport to="#modals">
  </teleport>
</article>
</template>

<script setup>
import { ref } from 'vue';
import ButtonBasic from '../../components/button/basic.vue';

const showFileManager = ref(false);
</script>

<style src="./common.scss" lang="scss" scoped></style>
<style lang="scss" scoped>
//
</style>
