<template>
<article>
  <header class="page-header">
    <h2>Forms</h2>
    <p>입력폼에서 사용되는 컴포넌트들에 대한 예제입니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h3>Form text</h3>
    </header>
    <p>
      <form-text
        placeholder="placeholder value"
        v-model="fooo"
        :required="true"
        :inline="false"
        :readonly="false"
        :disabled="false"
        form-size="small"/>
    </p>
    <p>
      <form-text
        placeholder="placeholder value"
        v-model="fooo"
        :required="true"
        :inline="false"
        :readonly="false"
        :disabled="false"/>
    </p>
    <p>
      <form-text
        placeholder="placeholder value"
        v-model="fooo"
        :required="true"
        :inline="false"
        :readonly="false"
        :disabled="true"
        form-size="large"/>
    </p>
    <p>
      <form-text
        type="textarea"
        name="fooo"
        id="fooo"
        placeholder="placeholder value"
        v-model="fooo"
        :required="true"
        :inline="true"/>
    </p>
  </section>

  <section class="page-section">
    <header>
      <h3>Form select-box</h3>
    </header>
    <p>
      <form-select :inline="true" form-size="small"/>
      <form-select
        name="select_name"
        id="select_id"
        v-model="select"
        :options="[
        { label: 'Foo', value: 'foo' },
        { label: 'Bar', value: 'bar' }
      ]"
        :inline="true"/>
      <form-select :inline="true" form-size="large"/>
      ==={{select}}===
    </p>
  </section>

  <section class="page-section">
    <header>
      <h3>Checkbox and Radio</h3>
    </header>
    <p>
      <form-check
        name="foo23123oo"
        v-model="checks"/>
      <form-check
        name="foooo"
        label="checkbox name"
        v-model="checks"/>
      ===========
      {{checks}}
    </p>
    <p>
      <form-check
        type="radio"
        name="fooo1"
        label="radio name"
        v-model="checks"
        :inline="true"/>
    </p>
    <fieldset>
      <legend>checkbox group</legend>
      <form-checks
        type="checkbox"
        name="smdgpsd"
        id="roooo"
        :inline="true"
        v-model="checkboxes"
        :disabled="false"
        :items="[
          { label: 'checks label#1', value: 'label-1' },
          { label: 'checks label#2', value: 'label-2' },
          { label: 'checks label#3', value: 'label-3' },
          { label: 'checks label#4', value: 'label-4' },
          { label: 'checks label#5', value: 'label-5' },
          { label: 'checks label#6', value: 'label-6' },
          { label: 'checks label#7', value: 'label-7' },
          { label: 'checks label#8', value: 'label-8' },
        ]"
        @change="changeCheckbox"
      />
      <hr>
      {{checkboxes}}
    </fieldset>
    <fieldset>
      <legend>radio group</legend>
      <form-checks
        type="radio"
        name="rtjnfgh"
        id="yoooo"
        v-model="radios"
        :inline="true"
        :disabled="false"
        :items="[
          { label: 'radio label#1', value: 'label-1' },
          { label: 'radio label#2', value: 'label-2' },
          { label: 'radio label#3', value: 'label-3' },
          { label: 'radio label#4', value: 'label-4' },
          { label: 'radio label#5', value: 'label-5' },
          { label: 'radio label#6', value: 'label-6' },
          { label: 'radio label#7', value: 'label-7' },
          { label: 'radio label#8', value: 'label-8' },
        ]"
      />
      <hr>
      {{radios}}
    </fieldset>
    <fieldset>
      <legend>field style</legend>
      <dl class="rg-form-field">
        <dt>
          <label for="sdmgmsdgp">label name</label>
        </dt>
        <dd>
          <form-text
            id="sdmgmsdgp"
            placeholder="placeholder value"
            :inline="true"
          />
          <p class="rg-form-help rg-form-help-error">error message</p>
          <p class="rg-form-help">help message</p>
        </dd>
      </dl>
    </fieldset>
  </section>

</article>
</template>

<script>
export default {
  components: {
    'form-text': () => import('~/components/form/text'),
    'form-select': () => import('~/components/form/select'),
    'form-check': () => import('~/components/form/check'),
    'form-checks': () => import('~/components/form/checks'),
  },
  data()
  {
    return {
      fooo: 'sdgmosdpg,sdg',
      select: 'foo',
      checks: false,
      checkboxes: [],
      radios: 'label-2',
    };
  },
  methods: {
    changeCheckbox(value)
    {
      this.checkboxes = value;
    },
  },
}
</script>

<style src="./pages.scss" lang="scss" scoped/>
<style lang="scss" scoped/>
