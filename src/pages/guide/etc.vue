<template>
<article>
  <header class="page-header">
    <h1>ETC components</h1>
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
      <h3>Loading</h3>
      <p>데이터를 로딩하고있을때 사용하는 컴포넌트 입니다.</p>
    </header>
    <div class="example">
      <Loading/>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h3>Progress donut</h3>
      <p>도넛 형태의 그래프를 표시하는 컴포넌트 입니다.</p>
    </header>
    <div class="example">
      <div class="flex flex--h-center">
        <ProgressDonut :percent="progress"/>
        <input type="range" v-model="progress" :min="0" :max="100" :step="10">
        <span style="width: 44px">{{progress}}%</span>
      </div>
    </div>
  </section>
</article>
</template>

<script setup>
import { ref } from 'vue';
import { toast } from '../../modules/toast';
import ButtonBasic from '../../components/button/basic.vue';
import Loading from '../../components/etc/loading.vue';
import ProgressDonut from '../../components/etc/progress-donut.vue';

const progress = ref(30);

function addToast(color)
{
  toast.add('hello toast', color);
}
</script>

<style src="./common.scss" lang="scss" scoped></style>
