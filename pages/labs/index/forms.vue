<template>
<article>
  <header class="page-header">
    <h2>Form components</h2>
    <p>입력폼에서 사용되는 컴포넌트들에 대한 예제입니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h3>text</h3>
      <p>
        <code>~/components/form/text</code>
      </p>
    </header>
    <p>폼 사이즈</p>
    <div class="example">
      <div class="rg-row rg-row-gutter-h">
        <div class="rg-col">
          <span>small</span>
          <form-text
            placeholder="placeholder value"
            v-model="text"
            :required="true"
            :inline="false"
            :readonly="false"
            :disabled="false"
            form-size="small"/>
        </div>
        <div class="rg-col">
          <span>normal</span>
          <form-text placeholder="placeholder value" v-model="text"/>
        </div>
        <div class="rg-col">
          <span>large</span>
          <form-text placeholder="placeholder value" v-model="text" form-size="large"/>
        </div>
      </div>
    </div>
    <p>`readonly`와 `disabled` 속성</p>
    <div class="example">
      <div class="rg-row rg-row-gutter-h">
        <div class="rg-col">
          <span>readonly</span>
          <form-text
            placeholder="placeholder value"
            v-model="text"
            :required="true"
            :inline="false"
            :readonly="true"
            :disabled="false"/>
        </div>
        <div class="rg-col">
          <span>disabled</span>
          <form-text
            placeholder="placeholder value"
            v-model="text"
            :required="true"
            :inline="false"
            :readonly="false"
            :disabled="true"/>
        </div>
      </div>
    </div>
    <p>멀티라인 입력폼</p>
    <div class="example">
      <form-text
        type="textarea"
        name="text"
        id="text"
        placeholder="placeholder value"
        v-model="text"
        :required="true"
        :inline="true"/>
    </div>
    <p>버튼과 함께 사용하기</p>
    <div class="example">
      <div class="rg-row rg-row-gutter-h">
        <div class="rg-col">
          <form-text placeholder="placeholder value"/>
        </div>
        <div class="rg-col">
          <button-basic type="button" color="key">label text</button-basic>
        </div>
      </div>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h3>select</h3>
      <p>
        <code>~/components/form/select</code>
      </p>
    </header>
    <div class="example">
      <div class="rg-row rg-row-gutter-h">
        <form-select v-model="select" :options="selectOptions" size="mini" class="rg-col"/>
        <form-select v-model="select" :options="selectOptions" size="small" class="rg-col"/>
        <form-select v-model="select" :options="selectOptions" class="rg-col"/>
        <form-select v-model="select" :options="selectOptions" size="large" class="rg-col"/>
        <form-select v-model="select" :options="selectOptions" :disabled="true" class="rg-col"/>
      </div>
      <p>
        <span>[selected value: {{select}}]</span>
      </p>
      <div>
        <form-select v-model="select" :inline="true">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
        </form-select>
      </div>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h3>checkbox</h3>
      <p>
        <code>~/components/form/checkbox</code>
      </p>
    </header>
    <div class="example">
      <div class="rg-row rg-row-v-center rg-row-gutter-h check-items">
        <label class="rg-col rg-row rg-row-v-center">
          <form-checkbox v-model="checkbox" size="small"/>
          <span>small</span>
        </label>
        <label class="rg-col rg-row rg-row-v-center">
          <form-checkbox v-model="checkbox"/>
          <span>normal</span>
        </label>
        <label class="rg-col rg-row rg-row-v-center">
          <form-checkbox v-model="checkbox" size="large"/>
          <span>large</span>
        </label>
        <label class="rg-col rg-row rg-row-v-center">
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
        <code>~/components/form/radio</code>
      </p>
    </header>
    <div class="example">
      <div class="rg-row rg-row-v-center rg-row-gutter-h check-items">
        <label class="rg-col rg-row rg-row-v-center">
          <form-radio name="radio" v-model="radio" value="radio1" size="small"/>
          <span>radio1(small)</span>
        </label>
        <label class="rg-col rg-row rg-row-v-center">
          <form-radio name="radio" v-model="radio" value="radio2"/>
          <span>radio2</span>
        </label>
        <label class="rg-col rg-row rg-row-v-center">
          <form-radio name="radio" v-model="radio" value="radio3" size="large"/>
          <span>radio3(large)</span>
        </label>
        <label class="rg-col rg-row rg-row-v-center">
          <form-radio name="radio" v-model="radio" value="radio4" :disabled="true"/>
          <span>disabled</span>
        </label>
      </div>
      <p>[checked value: {{radio}}]</p>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h3>content-editable</h3>
      <p>
        <code>~/components/form/content-editable</code>
      </p>
    </header>
    <div class="example content-editable">
      <form-content-editable
        v-model="contentEditable"
        class="content-editable__body"/>
      <hr class="content-editable__line">
      <pre class="content-editable__render">{{contentEditable}}</pre>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h3>keyword</h3>
      <p>
        <code>~/components/form/keyword</code>
      </p>
    </header>
    <div class="example">
      <form-keyword
        v-model="keyword"
        :processing="false"
        :disabled="false"
        form-size="large"
        @clear="keyword = ''"
        @submit=""/>
      <p>{{keyword}}</p>
    </div>
  </section>
</article>
</template>

<script>
export default {
  components: {
    'form-text': () => import('~/components/form/text'),
    'form-select': () => import('~/components/form/select'),
    'form-checkbox': () => import('~/components/form/checkbox'),
    'form-radio': () => import('~/components/form/radio'),
    'form-content-editable': () => import('~/components/form/content-editable'),
    'form-keyword': () => import('~/components/form/keyword'),
    'button-basic': () => import('~/components/button/basic'),
  },
  data()
  {
    return {
      text: 'text value',
      select: 'apple',
      selectOptions: [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
        { label: 'Mango', value: 'mango' },
      ],
      checkbox: false,
      radio: 'radio1',
      contentEditable: 'hello',
      keyword: 'foo',
    };
  },
}
</script>

<style src="./pages.scss" lang="scss" scoped/>
<style lang="scss" scoped>
.check-items {
  > label > span {
    margin-left: 8px;
  }
}
.content-editable {
  &__body {
    box-sizing: border-box;
    padding: 16px;
    background: var(--color-content-bg);
  }
  &__line {
    display: block;
    margin: 16px 0;
    height: 1px;
    border: none;
    background: var(--color-content-line);
  }
}
</style>
