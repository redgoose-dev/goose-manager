<template>
<article>
  <header class="page-header">
    <h1>Form components</h1>
    <p>입력폼에서 사용되는 컴포넌트들에 대한 예제입니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h3>checkbox</h3>
      <p>
        <code>/src/components/form/checkbox.vue</code>
      </p>
    </header>
    <div class="example">
      <div class="grid grid--col-4">
        <label class="flex flex--small-gap">
          <form-checkbox v-model="checkbox" size="small"/>
          <span>small</span>
        </label>
        <label class="flex flex--small-gap">
          <form-checkbox v-model="checkbox"/>
          <span>normal</span>
        </label>
        <label class="flex flex--small-gap">
          <form-checkbox v-model="checkbox" size="large"/>
          <span>large</span>
        </label>
        <label class="flex flex--small-gap">
          <form-checkbox v-model="checkbox" :disabled="true"/>
          <span>disabled</span>
        </label>
      </div>
      <p>
        <span>[checked value: {{checkbox}}]</span>
      </p>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h3>radio</h3>
      <p>
        <code>/src/components/forms/radio.vue</code>
      </p>
    </header>
    <div class="example">
      <div class="grid grid--col-4">
        <label class="flex flex--small-gap">
          <FormRadio name="radio" v-model="radio" value="radio1" size="small"/>
          <span>radio1(small)</span>
        </label>
        <label class="flex flex--small-gap">
          <FormRadio name="radio" v-model="radio" value="radio2"/>
          <span>radio2</span>
        </label>
        <label class="flex flex--small-gap">
          <FormRadio name="radio" v-model="radio" value="radio3" size="large"/>
          <span>radio3(large)</span>
        </label>
        <label class="flex flex--small-gap">
          <FormRadio name="radio" v-model="radio" value="radio4" :disabled="true"/>
          <span>disabled</span>
        </label>
      </div>
      <p>[checked value: {{radio}}]</p>
    </div>
  </section>
</article>
</template>

<script setup>
import { ref } from 'vue';
import FormCheckbox from '../../components/forms/checkbox.vue';
import FormRadio from '../../components/forms/radio.vue';

const checkbox = ref(false);
const radio = ref('radio1');
</script>

<style src="./common.scss" lang="scss" scoped></style>
<style lang="scss" scoped>

</style>
