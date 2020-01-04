<template>
<article>
  <page-header module="categories" title="Categories / Delete"/>
  <form @submit.prevent="onSubmit" class="rg-form-delete">
    <input type="hidden" name="srl" :value="srl"/>
    <warning-message>
        <p>다음 `Category`를 삭제하시겠습니까?</p>
        <p><strong>{{forms.name}}</strong></p>
    </warning-message>
    <nav-bottom>
      <template slot="left">
        <button-basic type="button" icon-left="arrow-left" @click="$router.back()">Back</button-basic>
      </template>
      <template slot="right">
        <button-basic
          type="submit"
          ref="button_submit"
          color="key"
          :icon-right="processing ? 'loader' : 'check'"
          :rotate-icon="processing"
          :disabled="processing">
          Delete Category
        </button-basic>
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
    'warning-message': () => import('~/components/form/fieldset/warning-message'),
  },
  validate(cox)
  {
    return cox.params.category && /^\d+$/.test(cox.params.category);
  },
  async asyncData(cox)
  {
    try
    {
      const srl = parseInt(cox.params.category);
      let res = await cox.$axios.$get(`/categories/${srl}/`);
      if (!res.success) throw res.message;
      return {
        srl,
        forms: {
          name: res.data.name,
        },
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
  methods: {
    async onSubmit(e)
    {
      try
      {
        this.processing = true;
        let res = await this.$axios.$post(`/categories/${this.srl}/delete/`);
        if (!res.success) throw res.message;
        this.processing = false;
        this.$router.replace(`../../`);
      }
      catch(e)
      {
        this.processing = false;
        if (e === messages.error.service) e = null;
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed delete Category.`,
          color: 'error',
        });
      }
    },
  },
}
</script>
