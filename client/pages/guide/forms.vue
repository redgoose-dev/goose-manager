<template>
<article>
  <header class="page-header">
    <h1>Form assets</h1>
    <p>입력폼에서 사용되는 컴포넌트들에 대한 예제입니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h1>text</h1>
      <p>
        텍스트를 입력하는 용도로 사용합니다.<br/>
        <strong>code:</strong> <code>/client/components/forms/input.vue</code>
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
        <FormInput v-model="text" size="small" placeholder="size=small"/>
        <FormInput v-model="text" placeholder="size=normal"/>
      </div>
      <hr>
      <pre>{{text}}</pre>
    </div>
    <p>readonly, disabled, error</p>
    <div class="example">
      <div class="grid grid--col-3">
        <FormInput placeholder="readonly" :readonly="true" model-value="readonly value"/>
        <FormInput placeholder="disabled" :disabled="true" model-value="disabled value"/>
        <FormInput placeholder="error" :error="true"/>
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
      <h1>textarea</h1>
      <p>
        여러줄의 텍스트를 입력하는 용도로 사용합니다.<br/>
        <strong>code:</strong> <code>/client/components/forms/textarea.vue</code>
      </p>
    </header>
    <div class="example">
      <FormTextarea
        v-model="textarea"
        :rows="3"
        placeholder="Please input text"/>
      <hr>
      <pre>{{textarea}}</pre>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h1>select</h1>
      <p>
        여러 항목중에 하나를 선택하는 용도로 사용합니다.<br/>
        <strong>code:</strong> <code>/client/components/forms/select.vue</code>
      </p>
    </header>
    <div class="example">
      <div class="grid grid--col-2">
        <div>
          <FormSelect v-model="select" :options="selectOptions"/>
        </div>
        <div>
          <FormSelect v-model="select" :options="selectOptions" size="small"/>
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
      <h1>checkbox</h1>
      <p>
        여러 항목을 선택하는 용도로 사용합니다.<br/>
        <strong>code:</strong> <code>/client/components/forms/checkbox.vue</code>
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
      <h1>radio</h1>
      <p>
        여러 항목들중 하나를 선택하는 용도로 사용합니다.<br/>
        <strong>code:</strong> <code>/client/components/forms/radio.vue</code>
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
      <h1>switch</h1>
      <p>
        true/false 토글링하는 용도로 사용합니다.<br/>
        <strong>code:</strong> <code>/client/components/forms/switch.vue</code>
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
        <FormSwitch v-model="customSwitch" :values="[ 'apple', 'mango' ]"/>
        <small>mango</small>
        <span>|</span>
        <span>Selected value: <strong>{{customSwitch}}</strong></span>
      </div>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h1>keyword</h1>
      <p>
        키워드를 입력할 수 있는 입력폼과 서브밋 버튼이 같이 붙어있는 컴포넌트입니다.<br/>
        <strong>code:</strong> <code>/client/components/forms/keyword.vue</code>
      </p>
    </header>
    <div class="example">
      <FormKeyword
        v-model="keywordMessage"
        :processing="keywordProcessing"
        :disabled="false"
        :use-clear="true"
        :use-submit="true"
        @clear="keywordMessage = ''"
        @submit="onSubmitKeyword"/>
      <hr>
      <FormKeyword
        v-model="keywordMessage"
        :processing="keywordProcessing"
        :disabled="false"
        :use-clear="true"
        :use-submit="true"
        size="small"
        @clear="keywordMessage = ''"
        @submit="onSubmitKeyword"/>
      <p>{{keywordMessage}}</p>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h1>tag</h1>
      <p>
        해시태그를 입력하는 UI 컴포넌트입니다.<br/>
        <strong>code:</strong> <code>/client/components/forms/tag.vue</code>
      </p>
    </header>
    <div class="example">
      <FormTag v-model="tag" :limit-count="10"/>
      <pre>{{tag}}</pre>
    </div>
    <h2>컴포넌트 작동 안내</h2>
    <p>
      단어를 입력하고 쉼표(,)를 입력하면 배열 목록에 태그 항목이 추가되고 새로운 태그를 입력할 수 있게됩니다.<br/>
      입력창에 아무것도 입력되지 않은 상태에서 백스페이스를 누르면 마지막 태그가 삭제됩니다.
    </p>
  </section>
</article>
</template>

<script setup>
import { ref } from 'vue'
import { sleep } from '../../libs/util.js'
import { ButtonBasic } from '../../components/button/index.js'
import { FormInput, FormTextarea, FormSelect, FormCheckbox, FormRadio, FormSwitch, FormKeyword, FormTag } from '../../components/forms/index.js'

const text = ref('')
const textarea = ref('')
const select = ref('')
const checkbox = ref(false)
const sw = ref(false)
const customSwitch = ref('apple')
const radio = ref('radio1')
const tag = ref('apple,banana,mango')
const contentEditable = ref('hello content-editable')
const keywordMessage = ref('hello keyword')
const keywordProcessing = ref(false)
const selectOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Mango', value: 'mango' },
]

async function onSubmitKeyword()
{
  keywordProcessing.value = true
  await sleep(3000)
  console.log('on submit keyword:', keywordMessage.value)
  keywordProcessing.value = false
}
</script>

<style src="./forms.scss" lang="scss" scoped></style>
