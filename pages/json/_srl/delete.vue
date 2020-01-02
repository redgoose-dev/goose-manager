<template>
<article>
  <page-header module="json" title="JSON / Delete"/>

  <form @submit.prevent="onSubmit" class="rg-form-delete">
    <input type="hidden" name="srl" :value="srl"/>
    <div class="rg-form-delete__message">
      <div>
        <p>다음 `JSON`을 삭제하시겠습니까?</p>
        <p><strong>{{data.name}}</strong></p>
      </div>
    </div>

    <nav-bottom>
      <template slot="left">
        <button-basic type="button" label="Back" icon-left="arrow-left" @click="$router.back()"/>
      </template>
      <template slot="right">
        <button-basic
          type="submit"
          ref="button_submit"
          color="key"
          label="Delete JSON"
          :icon-left="processing ? 'loader' : 'check'"
          :rotate-icon="processing"
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
      const srl = parseInt(cox.params.srl);
      let res = await cox.$axios.$get(`/json/${srl}/?field=name`);
      if (!res.success) throw res.message;
      return {
        srl,
        processing: false,
        data: res.data,
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
        let res = await this.$axios.$post(`/json/${this.srl}/delete/`);
        if (!res.success) throw res.message;
        this.processing = false;
        this.$router.replace('/json/');
      }
      catch(e)
      {
        this.processing = false;
        if (e === messages.error.service) e = null;
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed delete JSON.`,
          color: 'error',
        });
      }
    },
  },
}
</script>
