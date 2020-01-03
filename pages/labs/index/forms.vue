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
    <div class="row row-gutter-h">
      <p class="col">
        <span>small</span>
        <form-text
          placeholder="placeholder value"
          v-model="text"
          :required="true"
          :inline="false"
          :readonly="false"
          :disabled="false"
          form-size="small"/>
      </p>
      <p class="col">
        <span>normal</span>
        <form-text placeholder="placeholder value" v-model="text"/>
      </p>
      <p class="col">
        <span>large</span>
        <form-text placeholder="placeholder value" v-model="text" form-size="large"/>
      </p>
    </div>
    <div class="row row-gutter-h">
      <p class="col">
        <span>readonly</span>
        <form-text
          placeholder="placeholder value"
          v-model="text"
          :required="true"
          :inline="false"
          :readonly="true"
          :disabled="false"/>
      </p>
      <p class="col">
        <span>disabled</span>
        <form-text
          placeholder="placeholder value"
          v-model="text"
          :required="true"
          :inline="false"
          :readonly="false"
          :disabled="true"/>
      </p>
    </div>
    <div>
      <span>multiple line</span>
      <form-text
        type="textarea"
        name="text"
        id="text"
        placeholder="placeholder value"
        v-model="text"
        :required="true"
        :inline="true"/>
    </div>
    <div>
      <p>with button</p>
      <div class="row row-gutter-h">
        <div class="col">
          <form-text placeholder="placeholder value"/>
        </div>
        <div class="col">
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
      <div class="row row-gutter-h">
        <form-select v-model="select" :options="selectOptions" size="small" class="col"/>
        <form-select v-model="select" :options="selectOptions" class="col"/>
        <form-select v-model="select" :options="selectOptions" size="large" class="col"/>
        <form-select v-model="select" :options="selectOptions" :disabled="true" class="col"/>
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
      <div class="row row-v-center row-gutter-h check-items">
        <label class="col row row-v-center">
          <form-checkbox v-model="checkbox" size="small"/>
          <span>small</span>
        </label>
        <label class="col row row-v-center">
          <form-checkbox v-model="checkbox"/>
          <span>normal</span>
        </label>
        <label class="col row row-v-center">
          <form-checkbox v-model="checkbox" size="large"/>
          <span>large</span>
        </label>
        <label class="col row row-v-center">
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
      <div class="row row-v-center row-gutter-h check-items">
        <label class="col row row-v-center">
          <form-radio name="radio" v-model="radio" value="radio1" size="small"/>
          <span>radio1(small)</span>
        </label>
        <label class="col row row-v-center">
          <form-radio name="radio" v-model="radio" value="radio2"/>
          <span>radio2</span>
        </label>
        <label class="col row row-v-center">
          <form-radio name="radio" v-model="radio" value="radio3" size="large"/>
          <span>radio3(large)</span>
        </label>
        <label class="col row row-v-center">
          <form-radio name="radio" v-model="radio" value="radio4" :disabled="true"/>
          <span>disabled</span>
        </label>
      </div>
      <p>[checked value: {{radio}}]</p>
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
</style>
