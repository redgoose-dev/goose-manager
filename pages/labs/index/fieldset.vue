<template>
<article>
  <header class="page-header">
    <h2>Form components</h2>
    <p>입력폼에서 사용되는 컴포넌트들에 대한 예제입니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h3>basic</h3>
      <p>기본적으로 사용하는 방식</p>
    </header>
    <div class="example">
      <field-wrap legend="Basic fields">
        <field label="Text" for="text">
          <template slot="body">
            <form-text
              id="text"
              placeholder="please input text"
              :inline="true"
              :size="30"/>
          </template>
        </field>
        <field label="Select" for="select">
          <template slot="body">
            <form-select
              id="select"
              :options="[
                { label: 'Apple', value: 'apple' },
                { label: 'Banana', value: 'banana' },
                { label: 'Mango', value: 'mango' },
              ]"
              :inline="true"/>
            <p class="form-help">Please select item</p>
          </template>
        </field>
      </field-wrap>
      <field-wrap legend="Optional fields" style="margin-top: 30px;">
        <field label="Radio buttons" for="radios">
          <template slot="body">
            <fieldset class="form-fieldset" :disabled="false">
              <legend>radio forms</legend>
              <div class="row row-v-center row-gutter-h">
                <label class="form-field">
                  <span><form-radio id="radios" name="radio" v-model="radio" value="apple"/></span>
                  <span>Apple</span>
                </label>
                <label class="form-field">
                  <span><form-radio name="radio" v-model="radio" value="banana"/></span>
                  <span>Banana</span>
                </label>
                <label class="form-field">
                  <span><form-radio name="radio" v-model="radio" value="mango"/></span>
                  <span>Mango</span>
                </label>
              </div>
            </fieldset>
            <p class="form-help">check value: <b class="error">{{radio}}</b></p>
          </template>
        </field>
        <field label="Checkbox buttons" for="checkboxes">
          <template slot="body">
            <fieldset class="form-fieldset">
              <div class="row row-v-center row-gutter-h">
                <label class="form-field">
                  <span>Apple</span>
                  <span>
                    <form-checkbox
                      id="checkboxes"
                      name="checkbox"
                      v-model="checkbox[0]"
                      value="apple"
                      @change="onChangeCheckbox"/>
                  </span>
                </label>
                <label class="form-field">
                  <span>Banana</span>
                  <span>
                    <form-checkbox
                      name="checkbox"
                      v-model="checkbox[1]"
                      value="banana"
                      @change="onChangeCheckbox"/>
                  </span>
                </label>
                <label class="form-field">
                  <span>Mango</span>
                  <span>
                    <form-checkbox
                      name="checkbox"
                      v-model="checkbox[2]"
                      value="mango"
                      @change="onChangeCheckbox"/>
                  </span>
                </label>
              </div>
            </fieldset>
            <p class="form-help">check value: <b class="error">{{checkbox}}</b></p>
          </template>
        </field>
        <field label="Mix forms">
          <template slot="body">
            <div class="row row-v-center row-gutter-h">
              <label class="form-field">
                <span><form-radio name="radio#2"/></span>
                <span>Radio#1</span>
              </label>
              <label class="form-field">
                <span><form-radio name="radio#2"/></span>
                <span>Radio#2</span>
              </label>
            </div>
            <div class="row row-v-center row-gutter-h" style="margin-top:10px;">
              <label class="form-field">
                <span>Text-form</span>
                <span>
                  <form-text placeholder="please input text" :size="10" form-size="small"/>
                </span>
              </label>
              <label class="form-field">
                <span>Text-form</span>
                <span>
                  <form-text placeholder="please input text" :size="10" form-size="small"/>
                </span>
              </label>
            </div>
          </template>
        </field>
      </field-wrap>
      <nav-bottom>
        <template slot="left">
          <button-basic type="button" icon-left="power"/>
          <button-basic type="button" icon-left="power">Power</button-basic>
        </template>
        <template slot="right">
          <button-basic type="button" icon-right="power" :rotate-icon="true"/>
          <button-basic type="button" icon-right="power">Power</button-basic>
          <button-basic type="submit" color="key" icon-left="check">Submit</button-basic>
        </template>
      </nav-bottom>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h3>delete</h3>
      <p>삭제할때 쓰는 폼</p>
    </header>
    <div class="example">
      .example
    </div>
  </section>
</article>
</template>

<script>
import * as fieldset from '~/components/form/fieldset';

export default {
  components: {
    'form-text': () => import('~/components/form/text'),
    'form-select': () => import('~/components/form/select'),
    'form-checkbox': () => import('~/components/form/checkbox'),
    'form-radio': () => import('~/components/form/radio'),
    'button-basic': () => import('~/components/button/basic'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'field-wrap': fieldset.wrap,
    'field': fieldset.field,
  },
  data()
  {
    return {
      radio: 'apple',
      checkbox: [false, false, false],
    };
  },
  methods: {
    onChangeCheckbox(sw, value)
    {
      console.log(sw, value);
    },
  }
}
</script>

<style src="./pages.scss" lang="scss" scoped/>
