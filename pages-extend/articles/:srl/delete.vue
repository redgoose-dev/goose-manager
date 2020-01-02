<template>
<article>
  <page-header module="articles" title="Articles / Delete"/>

  <form @submit.prevent="onSubmit" class="rg-form-delete">
    <input type="hidden" name="srl" :value="srl"/>
    <div class="rg-form-delete__message">
      <div>
        <p>
          다음 `Article`을 삭제하시겠습니까?<br/>
          이것을 삭제하면 하위의 `File`의 데이터가 삭제됩니다.
        </p>
        <p><strong>{{forms.title}}</strong></p>
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
          label="Delete article"
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
import * as text from '~/libs/text';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'button-basic': () => import('~/components/button/basic'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
  },
  validate(cox)
  {
    return cox.params.article && /^\d+$/.test(cox.params.article);
  },
  async asyncData(cox)
  {
    try
    {
      const srl = cox.params.article;
      const nest_srl = cox.query.nest || null;
      const category_srl = cox.query.category || null;
      const page = cox.query.page || null;

      let res = await cox.$axios.$get(`/articles/${srl}/?visible_type=all`);
      if (!res.success) throw res.message;
      return {
        srl,
        nest_srl,
        category_srl,
        page,
        processing: false,
        forms: {
          title: res.data.title,
        }
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
        let res = await this.$axios.$post(`/articles/${this.srl}/delete/`);
        if (!res.success) throw res.message;
        this.processing = false;

        // redirect to index
        let params = {};
        if (this.category_srl) params.category = this.category_srl;
        if (this.page && this.page > 1) params.page = this.page;
        // let url = `/articles${this.nest_srl ? `/${this.nest_srl}` : ''}/`;
        this.$router.replace('../../');
        // this.$router.replace(url + text.serialize(params, true));
      }
      catch(e)
      {
        this.processing = false;
        if (e === messages.error.service) e = null;
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed delete Article.`,
          color: 'error',
        });
      }
    }
  }
}
</script>
