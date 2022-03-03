<template>
<article>
  <header class="page-header">
    <h1>Form assets</h1>
    <p>입력폼에서 사용되는 컴포넌트들에 대한 예제입니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h2>text</h2>
      <p>
        <code>/src/components/forms/text.vue</code>
      </p>
    </header>
    <p>다양한 타입</p>
    <div class="example">
      <div class="grid grid--col-4">
        <FormInput type="text" placeholder="type=text"/>
        <FormInput type="password" placeholder="type=password"/>
        <FormInput type="number" :step="5" :min="0" :max="200" placeholder="type=number"/>
        <FormInput type="date" placeholder="type=date"/>
      </div>
    </div>
    <p>사이즈</p>
    <div class="example">
      <div class="grid grid--col-2">
        <FormInput
          v-model="text"
          size="small"
          placeholder="size=small"/>
        <FormInput
          v-model="text"
          placeholder="size=normal"/>
      </div>
      <hr>
      <pre>{{text}}</pre>
    </div>
    <p>`readonly`와 `disabled` 속성</p>
    <div class="example">
      <div class="grid grid--col-2">
        <FormInput
          placeholder="readonly"
          :readonly="true"/>
        <FormInput
          placeholder="disabled"
          :disabled="true"/>
      </div>
    </div>
    <p>버튼과 함께 사용하기</p>
    <div class="example">
      <div class="flex flex--small-gap">
        <div>
          <FormInput type="text" placeholder="type=text"/>
        </div>
        <div>
          <ButtonBasic>Submit</ButtonBasic>
        </div>
      </div>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h2>textarea</h2>
      <p>
        <code>/src/components/forms/textarea.vue</code>
      </p>
    </header>
    <div class="example">
      <FormTextarea
        v-model="textarea"
        :auto-size="true"
        :rows="2"
        placeholder="Please input text"/>
      <hr>
      <pre>{{textarea}}</pre>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h2>select</h2>
      <p>
        <code>/src/components/forms/select.vue</code>
      </p>
    </header>
    <div class="example">
      <div class="grid grid--col-2">
        <div>
          <FormSelect v-model="select" :options="selectOptions" size="small"/>
        </div>
        <div>
          <FormSelect v-model="select" :options="selectOptions"/>
        </div>
        <div>
          <FormSelect v-model="select" :options="selectOptions" :disabled="true"/>
        </div>
        <div>
          <FormSelect v-model="select">
            <option value="">Please select item</option>
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="mango">Mango</option>
          </FormSelect>
        </div>
      </div>
      <p>
        <span>[selected value: {{select}}]</span>
      </p>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h2>checkbox</h2>
      <p>
        <code>/src/components/forms/checkbox.vue</code>
      </p>
    </header>
    <div class="example">
      <div class="grid grid--col-3">
        <label class="flex flex--small-gap flex--v-center">
          <FormCheckbox v-model="checkbox" size="small"/>
          <span>small</span>
        </label>
        <label class="flex flex--small-gap flex--v-center">
          <FormCheckbox v-model="checkbox"/>
          <span>normal</span>
        </label>
        <label class="flex flex--small-gap flex--v-center">
          <FormCheckbox v-model="checkbox" :disabled="true"/>
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
      <h2>radio</h2>
      <p>
        <code>/src/components/forms/radio.vue</code>
      </p>
    </header>
    <div class="example">
      <div class="grid grid--col-3">
        <label class="flex flex--small-gap flex--v-center">
          <FormRadio name="radio" v-model="radio" value="radio1" size="small"/>
          <span>radio1(small)</span>
        </label>
        <label class="flex flex--small-gap flex--v-center">
          <FormRadio name="radio" v-model="radio" value="radio2"/>
          <span>radio2(normal)</span>
        </label>
        <label class="flex flex--small-gap flex--v-center">
          <FormRadio name="radio" v-model="radio" value="radio4" :disabled="true"/>
          <span>disabled</span>
        </label>
      </div>
      <p>[checked value: {{radio}}]</p>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h2>switch</h2>
      <p>
        <code>/src/components/forms/switch.vue</code>
      </p>
    </header>
    <div class="example">
      <div class="flex flex--v-center">
        <FormSwitch v-model="sw"/>
        <span>{{sw}}</span>
        <span>/</span>
        <span>disabled:</span>
        <FormSwitch v-model="sw" :disabled="true"/>
        <span>/</span>
        <span>readonly:</span>
        <FormSwitch v-model="sw" :readonly="true"/>
      </div>
      <hr>
      <div class="flex flex--v-center">
        <small>apple</small>
        <FormSwitch
          v-model="customSwitch"
          :values="[ 'apple', 'mango' ]"/>
        <small>mango</small>
        <span>|</span>
        <span>Selected value: <strong>{{customSwitch}}</strong></span>
      </div>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h2>content-editable</h2>
      <p>
        <code>/src/components/forms/content-editable.vue</code>
      </p>
    </header>
    <div class="example content-editable">
      <FormContentEditable
        v-model="contentEditable"
        class="content-editable__body"/>
      <hr class="content-editable__line">
      <pre class="content-editable__render">{{contentEditable}}</pre>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h2>keyword</h2>
      <p>
        <code>/src/components/forms/keyword.vue</code>
      </p>
    </header>
    <div class="example">
      <FormKeyword
        v-model="keywordMessage"
        :processing="keywordProcessing"
        :disabled="false"
        size=""
        @clear="keywordMessage = ''"
        @submit="onSubmitKeyword"/>
      <p>{{keywordMessage}}</p>
    </div>
  </section>
</article>
</template>

<script setup>
import { ref } from 'vue';
import { sleep } from '../../libs/util';
import FormSelect from '../../components/forms/select.vue';
import FormCheckbox from '../../components/forms/checkbox.vue';
import FormRadio from '../../components/forms/radio.vue';
import FormContentEditable from '../../components/forms/content-editable.vue';
import FormKeyword from '../../components/forms/keyword.vue';
import FormTextarea from '../../components/forms/textarea.vue';
import FormInput from '../../components/forms/input.vue';
import FormSwitch from '../../components/forms/switch.vue';
import ButtonBasic from '../../components/button/basic.vue';

const text = ref(null);
const textarea = ref(null);
const select = ref(null);
const checkbox = ref(false);
const sw = ref(false);
const customSwitch = ref('apple');
const radio = ref('radio1');
const contentEditable = ref('hello content-editable');
const keywordMessage = ref('hello keyword');
const keywordProcessing = ref(false);
const selectOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Mango', value: 'mango' },
];

async function onSubmitKeyword(e)
{
  keywordProcessing.value = true;
  await sleep(2000);
  console.log('on submit keyword:', keywordMessage.value);
  keywordProcessing.value = false;
}
</script>

<style src="./common.scss" lang="scss" scoped></style>
<style lang="scss" scoped>
.content-editable {
  &__body {
    box-sizing: border-box;
    padding: 16px;
    border-radius: 2px;
    box-shadow: inset 1px 4px 20px rgb(0 0 0 / 5%);
    max-height: 150px;
    border: 1px solid rgb(var(--color-base-rgb) / 20%);
    overflow: auto;
  }
  &__line {
    display: block;
    margin: 20px 0;
    height: 0;
    border: none;
    border-top: 1px dashed var(--color-weak);
  }
  &__render {
    padding: 16px;
    white-space: break-spaces;
    word-break: keep-all;
    word-wrap: break-word;
    border-radius: 2px;
    background: rgb(var(--color-base-rgb) / 10%);
    box-shadow: inset 1px 4px 20px rgb(0 0 0 / 5%);
    line-height: 1.42;
    user-select: none;
  }
}
</style>
