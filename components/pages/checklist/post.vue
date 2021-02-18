<template>
<form
  ref="form"
  class="edit-item__form"
  @submit.prevent="onSubmit">
  <fieldset class="edit-item__fieldset">
    <legend>Edit item form in checklist</legend>
    <h3 class="edit-item__date">{{computedDate}}</h3>
    <form-content-editable
      v-model="form.content"
      class="edit-item__body"/>
  </fieldset>
  <nav-bottom>
    <template slot="left">
      <button-basic type="button" icon-left="arrow-left" @click="$router.back()">Back</button-basic>
    </template>
    <template slot="right">
      <button-basic
        type="submit"
        color="key"
        :icon-left="processing ? 'loader' : 'check'"
        :rotate-icon="processing"
        :disabled="processing">
        Edit item
      </button-basic>
    </template>
  </nav-bottom>
</form>
</template>

<script>
import { convertDateFormat } from '~/components/pages/checklist/src';

export default {
  name: 'checklist-post',
  components: {
    'form-content-editable': () => import('~/components/form/content-editable'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'button-basic': () => import('~/components/button/basic'),
  },
  props: {
    datas: {
      srl: { type: Number },
      regdate: { type: String, default: null },
      content: { type: String, default: '' },
    },
  },
  data()
  {
    return {
      processing: false,
      form: {
        ...this.datas,
      },
    };
  },
  computed: {
    computedDate()
    {
      if (!this.datas) return;
      const { preference } = this.$store.state;
      const regdate = this.datas.regdate.split('-').map(o => Number(o));
      return convertDateFormat(new Date(regdate[0], regdate[1]-1, regdate[2]), preference.checklist.format);
    },
  },
  methods: {
    async onSubmit()
    {
      this.processing = true;
      console.log('call onSubmit()');
      // this.processing = false;
      // this.$router.push('../');
    },
  },
}
</script>
