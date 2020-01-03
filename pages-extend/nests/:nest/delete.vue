<template>
<article>
  <page-header module="nests" title="Nest / Delete"/>
  <form @submit.prevent="onSubmit" class="rg-form-delete">
    <input type="hidden" name="srl" :value="srl"/>
    <div class="rg-form-delete__message">
      <div>
        <p>
          다음 `Nest`를 삭제하시겠습니까?<br/>
          이것을 삭제하면 하위의 `Article`, `Category`, `File`의 데이터가 삭제됩니다.
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
          Delete Nest
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
    return cox.params.nest && /^\d+$/.test(cox.params.nest);
  },
  async asyncData(cox)
  {
    const srl = parseInt(cox.params.nest);
    try
    {
      let res = await cox.$axios.$get(`/nests/${srl}/?field=id,name`);
      if (!res.success) throw res.message;
      return {
        srl,
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
        let res = await this.$axios.$post(`/nests/${this.srl}/delete/`);
        if (!res.success) throw res.message;
        this.processing = false;
        this.$router.replace('../../');
      }
      catch(e)
      {
        this.processing = false;
        if (e === messages.error.service) e = null;
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed delete Nest.`,
          color: 'error',
        });
      }
    },
  },
}
</script>
