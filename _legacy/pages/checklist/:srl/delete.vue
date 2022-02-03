<template>
<article>
  <page-header module="checklist" title="Checklist / Delete"/>
  <form @submit.prevent="onSubmit" class="rg-form-delete">
    <input type="hidden" name="srl" :value="srl"/>
    <warning-message>
      <p>다음 `Checklist item`을 삭제하시겠습니까?</p>
      <p><strong>{{item}}</strong></p>
    </warning-message>
    <nav-bottom>
      <template slot="left">
        <button-basic
          type="button"
          icon-left="arrow-left"
          @click="$router.back()">
          Back
        </button-basic>
      </template>
      <template slot="right">
        <button-basic
          type="submit"
          ref="button_submit"
          color="key"
          :icon-left="processing ? 'loader' : 'check'"
          :rotate-icon="processing"
          :disabled="processing">
          Delete checklist item
        </button-basic>
      </template>
    </nav-bottom>
  </form>
</article>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
  name: 'page-checklist-delete-item',
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'button-basic': () => import('~/components/button/basic'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'warning-message': () => import('~/components/form/fieldset/warning-message'),
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
      let res = await cox.$axios.$get(`/checklist/${srl}/?field=regdate`);
      if (!res.success) throw res.message;
      return {
        srl,
        processing: false,
        item: res.data.regdate,
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
    async onSubmit()
    {
      try
      {
        this.processing = true;
        let res = await this.$axios.$post(`/checklist/${this.srl}/delete/`);
        if (!res.success) throw res.message;
        this.processing = false;
        this.$router.replace('../../list/').then();
      }
      catch(e)
      {
        this.processing = false;
        if (e === messages.error.service) e = null;
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed delete checklist item.`,
          color: 'error',
        });
      }
    },
  },
}
</script>
