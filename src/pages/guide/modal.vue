<template>
<article>
  <header class="page-header">
    <h1>Modal</h1>
    <p>레이어 팝업창 컴포넌트</p>
  </header>

  <section class="page-section">
    <header>
      <h2>basic</h2>
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
    <Modal :show="windowType" @close="windowType = false">
      <ModalBody type="window" style="padding: 30px">
        <div>window type content</div>
      </ModalBody>
    </Modal>
    <Modal :show="fullSize" :scroll="true" @close="fullSize = false">
      <ModalBody type="full">
        <article class="modal-full-content">
          <header>
            <h3>full size content</h3>
            <p>header description</p>
          </header>
          <nav>
            <ButtonBasic color="sub" @click="fullSize = false">
              Close modal
            </ButtonBasic>
          </nav>
        </article>
      </ModalBody>
    </Modal>
  </teleport>
</article>
</template>

<script setup>
import { ref } from 'vue'
import { Modal, ModalBody } from '../../components/modal'
import { ButtonBasic } from '../../components/button'

const windowType = ref(false)
const fullSize = ref(false)
</script>

<style src="./common.scss" lang="scss" scoped></style>
<style lang="scss" scoped>
.modal-full-content {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 100%;
  text-align: center;
  flex-direction: column;
}
</style>
