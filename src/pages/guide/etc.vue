<template>
<article>
  <header class="page-header">
    <h1>ETC</h1>
    <p>기타 잡다한 컴포넌트들</p>
  </header>

  <section class="page-section">
    <header>
      <h2>Toast component</h2>
      <p>상태나 알림 메시지를 보여주는 토스트 컴포넌트</p>
    </header>
    <div class="example">
      <div class="grid grid--col-3">
        <ButtonBasic @click="addToast()">toast / normal</ButtonBasic>
        <ButtonBasic @click="addToast('success')">toast / success</ButtonBasic>
        <ButtonBasic @click="addToast('error')">toast / error</ButtonBasic>
      </div>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h2>Loading</h2>
      <p>데이터를 로딩하고있을때 사용하는 컴포넌트 입니다.</p>
    </header>
    <div class="example">
      <Loading/>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h2>Progress donut</h2>
      <p>도넛 형태의 그래프를 표시하는 컴포넌트 입니다.</p>
    </header>
    <div class="example">
      <div class="flex flex--h-center flex--v-center">
        <ProgressDonut :label="true" :percent="Number(progress)"/>
        <input type="range" v-model="progress" :min="0" :max="100" :step="10">
        <span style="width: 44px">{{progress}}%</span>
      </div>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h2>Pagination</h2>
      <p>목록에서 사용하는 페이지 네비게이션</p>
    </header>
    <div class="example">
      <Pagination
        v-model="page"
        :total="200"
        :size="10"
        :range="8"
        @update:modelValue="onUpdatePage"/>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h2>Files manager</h2>
      <p>파일을 업로드하고 관리하는 컴포넌트</p>
    </header>
    <div class="example example--file-manager">
      <FilesManager tab="global"/>
    </div>
  </section>
</article>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { preferenceStore } from '../../store/preference'
import { toast } from '../../modules/toast'
import { ButtonBasic } from '../../components/button'
import Loading from '../../components/etc/loading.vue'
import ProgressDonut from '../../components/etc/progress-donut.vue'
import Pagination from '../../components/etc/pagination.vue'
import FilesManager from '../../components/files-manager/index.vue'

const preference = preferenceStore()
const progress = ref<number>(30)
const page = ref<number>(1)

function addToast(color?: string): void
{
  toast.add('hello toast', color)
}

function onUpdatePage(page: number): void
{
  console.log('onUpdatePage()', page)
}
</script>

<style src="./common.scss" lang="scss" scoped></style>
<style lang="scss" scoped>
.example--file-manager {
  padding: 0;
  overflow: hidden;
}
</style>
