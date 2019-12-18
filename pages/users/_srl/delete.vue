<template>
<article>
  <page-header module="users" title="Delete user"/>

  <form @submit.prevent="onSubmit" class="rg-form-delete">
    <input type="hidden" name="srl" :value="srl"/>
    <p class="rg-form-delete__message">
      <strong>{{data.email}}({{data.name}})</strong> User를 삭제하시겠습니까?
    </p>
    <nav-bottom>
      <template slot="left">
        <button-basic type="button" label="Back" @click="$router.back()"/>
      </template>
      <template slot="right">
        <button-basic
          type="submit"
          ref="button_submit"
          color="key"
          :label="!processing ? 'Delete' : null"
          :icon="processing ? 'cached' : ''"
          :rotateIcon="processing"
          :disabled="processing"/>
      </template>
    </nav-bottom>
  </form>
</article>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'button-basic': () => import('~/components/button/basic'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
  },
  validate(cox)
  {
    return cox.params.srl && /^\d+$/.test(cox.params.srl);
  },
  async asyncData(cox)
  {
    try
    {
      let res = await cox.$axios.$get(`/users/${cox.params.srl}/`);
      if (!res.success) throw res.message;
      return {
        data: res.data,
        srl: cox.params.srl,
        processing: false,
      };
    }
    catch(e)
    {
      cox.error({
        statusCode: 500,
        message: (typeof e === 'string') ? e : messages.error.service,
      });
    }
  },
  mounted()
  {
    setTimeout(() => this.$refs.button_submit.$el.focus(), 100);
  },
  methods: {
    async onSubmit(e)
    {
      try
      {
        this.processing = true;
        let res = await this.$axios.$post(`/users/${this.srl}/delete/`);
        if (!res.success) throw res.message;
        this.processing = false;
        this.$router.replace('/users/');
      }
      catch(e)
      {
        this.processing = false;
        if (e === messages.error.service) e = null;
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed delete user.`,
          color: 'error',
        });
      }
    },
  },
}
</script>