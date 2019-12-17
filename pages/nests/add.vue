<template>
<article>
  <page-header module="nests" title="Add nest"/>
  <post ref="post" type="add" :datas="datas" />
</article>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'post': () => import('~/components/pages/nests/post'),
  },
  async asyncData(cox)
  {
    try
    {
      // get apps
      let res = await cox.$axios.$get('/apps/?field=srl,id,name&strict=1');
      if (!res.success) throw 'Not found `apps`';
      return {
        datas: {
          apps: res.data.index,
          articleSkins: []
        },
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
    setTimeout(() => this.$refs.post.$refs.form.apps.focus(), 200);
  },
}
</script>