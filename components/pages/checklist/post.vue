<template>
<form ref="form" class="checklist-post" @submit.prevent="onSubmit">
  <fieldset class="checklist-post__fieldset">
    <legend>Edit item form in checklist</legend>
    <h3 class="checklist-post__date">{{computedDate}}</h3>
    <form-content-editable
      v-model="form.content"
      class="checklist-post__body"
      @submit="onSubmit"/>
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
import * as messages from '~/libs/messages';
import { dateFormat } from '~/libs/dates';

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
      return dateFormat(new Date(regdate[0], regdate[1]-1, regdate[2]), preference.checklist.format);
    },
  },
  methods: {
    async onSubmit()
    {
      try
      {
        this.processing = true;
        let res = await this.$axios.$post(`/checklist/${this.form.srl}/edit/`, {
          content: this.form.content,
        });
        if (!res.success) throw res.message;
        this.processing = false;
        // redirect
        await this.$router.push('../');
      }
      catch(e)
      {
        if (e === messages.error.service) e = null;
        this.processing = false;
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed edit checklist item.`,
          color: 'error',
        });
      }
    },
  },
}
</script>

<style src="./post.scss" lang="scss" scoped></style>
