<template>
<article>
  <header class="page-header">
    <h1>Fieldset</h1>
    <p>입력폼 필드셋에서 사용되는 컴포넌트들의 예제입니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h2>Fields</h2>
      <p>폼에서 사용되는 요소들</p>
    </header>
    <div class="example">
      <Fieldset legend="Basic fields">
        <Field label="Text" for="text">
          <FormInput v-model="text" id="text" style="--input-width: 360px"/>
          <Help>
            Typed text: <strong>{{text || 'none'}}</strong>
          </Help>
        </Field>
        <Field label="Select" for="select">
          <FormSelect v-model="select" placeholder="Please select item" style="--select-width: 200px">
            <option value="">Please select item</option>
            <option value="apple">apple</option>
            <option value="banana">banana</option>
            <option value="mango">mango</option>
          </FormSelect>
          <Help>
            Selected item: <strong>{{select || 'none'}}</strong>
          </Help>
        </Field>
      </Fieldset>
      <Fieldset legend="Optional fields" class="optional-fieldset">
        <Field label="Radio buttons" for="radios">
          <Labels>
            <Label>
              <FormRadio name="radios" id="radios" v-model="radio" value="apple"/>
              <span>Apple</span>
            </Label>
            <Label>
              <FormRadio name="radios" v-model="radio" value="banana"/>
              <span>Banana</span>
            </Label>
            <Label>
              <FormRadio name="radios" v-model="radio" value="mango"/>
              <span>Mango</span>
            </Label>
          </Labels>
          <Help>
            Check value: <strong>{{radio}}</strong>
          </Help>
        </Field>
        <Field label="Mix forms">
          <div class="flex">
            <Labels>
              <Label>
                <FormRadio name="radios2" value="apple"/>
                <span>Apple</span>
              </Label>
              <Label>
                <FormRadio name="radios2" value="banana"/>
                <span>Banana</span>
              </Label>
            </Labels>
          </div>
          <div class="flex">
            <Labels>
              <Label>
                <span>Width:</span>
                <FormInput
                  type="number"
                  size="small"
                  placeholder="0"
                  style="--input-width: 70px"/>
                <span>px</span>
              </Label>
              <Label>
                <span>Height:</span>
                <FormInput
                  type="number"
                  size="small"
                  placeholder="0"
                  style="--input-width: 70px"/>
                <span>px</span>
              </Label>
            </Labels>
          </div>
        </Field>
        <Columns>
          <Field label="Checkbox buttons" for="checkboxes">
            <Labels>
              <Label>
                <FormCheckbox name="checkboxes" id="checkboxes" v-model="checkbox[0]"/>
                <span>Apple</span>
              </Label>
              <Label>
                <FormCheckbox name="checkboxes" v-model="checkbox[1]"/>
                <span>Banana</span>
              </Label>
              <Label>
                <FormCheckbox name="checkboxes" v-model="checkbox[2]"/>
                <span>Mango</span>
              </Label>
            </Labels>
            <Help>
              Check value: <strong>{{checkbox}}</strong>
            </Help>
          </Field>
          <Field label="Side input" for="column-input">
            <Labels>
              <Label>
                <FormRadio name="radios3" value="apple"/>
                <span>Apple</span>
              </Label>
              <Label>
                <FormRadio name="radios3" value="banana"/>
                <span>Banana</span>
              </Label>
            </Labels>
          </Field>
        </Columns>
      </Fieldset>
      <Controller class="controller">
        <template #left>
          <ButtonBasic icon-left="menu">List</ButtonBasic>
        </template>
        <template #right>
          <ButtonBasic icon-left="edit">Edit</ButtonBasic>
          <ButtonBasic color="key" icon-left="sun">Submit</ButtonBasic>
        </template>
      </Controller>
    </div>
  </section>
</article>
</template>

<script setup>
import { ref } from 'vue';
import { Fieldset, Field, Columns, Controller, Labels, Label, Help } from '../../components/forms/fieldset';
import FormInput from '../../components/forms/input.vue';
import FormSelect from '../../components/forms/select.vue';
import FormCheckbox from '../../components/forms/checkbox.vue';
import FormRadio from '../../components/forms/radio.vue';
import ButtonBasic from '../../components/button/basic.vue';

const text = ref('');
const select = ref('');
const radio = ref('apple');
const checkbox = ref([ true, false, false ]);
</script>

<style src="./common.scss" lang="scss" scoped></style>
<style lang="scss" scoped>
.optional-fieldset {
  margin-top: 30px;
}
.help {
  strong {
    color: var(--color-key);
  }
}
</style>
