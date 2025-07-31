<template>
<article>
  <header class="page-header">
    <h1>Modal</h1>
    <p>레이어 팝업창 컴포넌트</p>
  </header>

  <section class="page-section">
    <header>
      <h1>basic</h1>
      <p>기본적인 형태로 사용됩니다.</p>
    </header>
    <div class="example flex flex--h-center">
      <div>
        <ButtonBasic @click="windowType = true">Window type</ButtonBasic>
      </div>
      <div>
        <ButtonBasic @click="fullSize = true">Full size</ButtonBasic>
      </div>
    </div>
  </section>

  <teleport to="#modals">
    <Modal
      :open="windowType"
      :scroll="true"
      :shortcut="true"
      mode="window"
      @close="windowType = false">
      <ModalWindow :scroll="true" class="modal-window-content">
        <article>
          <h1>modal title</h1>
          <p>window type content</p>
        </article>
      </ModalWindow>
    </Modal>
    <Modal
      :open="fullSize"
      :scroll="true"
      :shortcut="true"
      mode="full"
      @close="fullSize = false">
      <article class="modal-full-content">
        <header>
          <h1>full size content</h1>
          <p>header description</p>
        </header>
        <nav>
          <ButtonBasic color="error" @click="fullSize = false">
            Close modal
          </ButtonBasic>
        </nav>
      </article>
    </Modal>
  </teleport>
</article>
</template>

<script setup>
import { ref } from 'vue'
import { Modal, ModalWindow } from '../../components/modal/index.js'
import { ButtonBasic } from '../../components/button/index.js'

const windowType = ref(false)
const fullSize = ref(false)
</script>

<style lang="scss" scoped>
@forward 'common';
.modal-full-content {
  display: grid;
  place-content: center;
  height: 100%;
  text-align: center;
  box-sizing: border-box;
  h1 {
    margin: 0;
    line-height: 1.15;
  }
  p {
    margin: 8px 0 0;
  }
  nav {
    margin: 24px 0 0;
  }
}
.modal-window-content {
  padding: 30px;
  width: auto;
  height: auto;
  h1 {
    margin: 0;
    line-height: 1.15;
  }
  p {
    margin: 8px 0 0;
  }
}
</style>
