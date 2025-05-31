<template>
<article>
  <header class="page-header">
    <h1>ETC</h1>
    <p>기타 잡다한 컴포넌트들</p>
  </header>

  <section class="page-section">
    <header>
      <h1>Files manager</h1>
      <p>파일을 업로드하고 관리하는 컴포넌트</p>
    </header>
    <div class="example">
      <FileManager
        tab="global"
        module="article"
        :module-srl="310"
        :is-window="true"
        :shortcut="true"
        :use-thumbnail="true"
        :use-fetch="true"
        class="example--file-manager"
        @insert="onInsertFromFileManager">
        <template #header>
          <FileManagerHeader
            title="가이드용 파일 매니저"
            :use-close="true"
            @close=""/>
        </template>
      </FileManager>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h1>Toast component</h1>
      <p>상태나 알림 메시지를 보여주는 토스트 컴포넌트</p>
    </header>
    <div class="example">
      <div class="grid grid--col-3">
        <ButtonBasic @click="addToast()">toast / default</ButtonBasic>
        <ButtonBasic color="key" @click="addToast('key')">toast / key</ButtonBasic>
        <ButtonBasic color="sub" @click="addToast('sub')">toast / sub</ButtonBasic>
        <ButtonBasic color="success" @click="addToast('success')">toast / success</ButtonBasic>
        <ButtonBasic color="error" @click="addToast('error')">toast / error</ButtonBasic>
      </div>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h1>Loading</h1>
      <p>데이터를 로딩하고있을때 사용하는 컴포넌트 입니다.</p>
    </header>
    <div class="example">
      <Loading :move="false"/>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h1>Progress donut</h1>
      <p>도넛 형태의 그래프를 표시하는 컴포넌트 입니다.</p>
    </header>
    <div class="example">
      <div class="flex flex--h-center flex--v-center">
        <ProgressDonut :percent="progress"/>
        <input type="range" v-model="progress" :min="0" :max="100" :step="5">
        <span style="width: 44px">{{progress}}%</span>
      </div>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h1>Pagination</h1>
      <p>목록에서 사용하는 페이지 네비게이션</p>
    </header>
    <div class="example">
      <Paginate
        v-model="page"
        :total="200"
        :size="10"
        :range="8"
        @update:modelValue="onUpdatePage"/>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h1>Dropdown</h1>
      <p>드롭다운 UI</p>
    </header>
    <div class="example flex">
      <Dropdown mode="click" :use-value="true" position="left" class="example--dropdown">
        <template #trigger>
          <ButtonBasic icon-right="chevron-down">
            트리거 버튼
          </ButtonBasic>
        </template>
        <Context
          :items="[
            { key: 'context-1', label: 'context #0', iconRight: 'star' },
            { key: 'context-1', label: 'context #1', iconLeft: 'link', iconRight: 'link', color: 'key' },
            { key: 'context-2', label: 'context #2', iconLeft: 'cloud', iconRight: 'cloud' },
            { key: 'context-3', label: 'context #3', iconLeft: 'droplet', iconRight: 'droplet' },
          ]"
          @select=""/>
      </Dropdown>
      <Dropdown mode="click" :use-value="true" position="right" :disabled="false">
        <Context
          :items="[ { key: 'context-1', label: 'context #0' } ]"
          @select=""/>
      </Dropdown>
    </div>
  </section>

  <!-- // TODO: 파일 매니저 작업 끝나면 들어갈 예정 -->
</article>
</template>

<script setup>
import { ref, inject } from 'vue'
import { ButtonBasic } from '../../components/button/index.js'
import Loading from '../../components/content/loading.vue'
import ProgressDonut from '../../components/content/progress-donut.vue'
import Paginate from '../../components/content/paginate.vue'
import { FileManager, FileManagerHeader } from '../../components/file-manager/index.js'
import { Dropdown, Context } from '../../components/navigation/dropdown/index.js'

const toast = inject('toast')
const progress = ref(30)
const page = ref(1)

function addToast(color)
{
  toast.add('hello toast', color)
}

function onUpdatePage(page)
{
  console.log('onUpdatePage()', page)
}

function onInsertFromFileManager(src)
{
  console.log('onInsertFromFileManager()', src)
}
</script>

<style lang="scss" scoped>
@forward 'common';
.example--file-manager {
  height: 560px;
  --file-manager-rows: auto 1fr;
}
.example--dropdown {
  width: 130px;
  --context-width: auto;
  --context-min-width: 160px;
}
</style>
