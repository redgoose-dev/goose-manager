<template>
<article>
  <page-header module="apps" title="Apps / Delete"/>

  <form @submit.prevent="onSubmit" class="rg-form-delete">
    <input type="hidden" name="srl" :value="srl"/>
    <div class="rg-form-delete__message">
      <div>
        <p>
          다음 `App`을 삭제하시겠습니까?<br/>
          이것을 삭제하면 하위의 `Nest`, `Article`, `Category`, `File`의 데이터가 삭제됩니다.
        </p>
        <p><strong>[{{forms.id}}] {{forms.name}}</strong></p>
      </div>
    </div>

    <nav-bottom>
      <template slot="left">
        <button-basic type="button" icon-left="arrow-left" @click="$router.back()">Back</button-basic>
      </template>
      <template slot="right">
        <button-basic
          type="submit"
          ref="button_submit"
          color="key"
          :icon-left="processing ? 'loader' : 'check'"
          :rotate-icon="processing"
          :disabled="processing">
          Delete app
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
      let res = await cox.$axios.$get(`/apps/${srl}/`);
      if (!res.success) throw res.message;
      return {
        srl: parseInt(cox.params.srl),
        processing: false,
        forms: {
          id: res.data.id,
          name: res.data.name,
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
  methods: {
    async onSubmit(e)
    {
      try
      {
        this.processing = true;
        // request api
        let res = await this.$axios.$post(`/apps/${this.srl}/delete/`);
        if (!res.success) throw res.message;
        this.processing = false;
        // redirect to index
        this.$router.replace('../../');
      }
      catch(e)
      {
        this.processing = false;
        if (e === messages.error.service) e = null;
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed delete App.`,
          color: 'error',
        });
      }
    },
  },
}
</script>
