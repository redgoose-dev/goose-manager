<template>
<article>
  <page-header module="nests" title="Edit nest"/>
  <post type="edit" :srl="srl" :datas="datas" />
</article>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'post': () => import('~/components/pages/nests/post'),
  },
  validate(cox)
  {
    return cox.params.srl && /^\d+$/.test(cox.params.srl);
  },
  async asyncData(cox)
  {
    try
    {
      let srl = parseInt(cox.params.srl);
      const [ apps, nest ] = await Promise.all([
        cox.$axios.$get('/apps/?field=srl,id,name&strict=1'),
        cox.$axios.$get(`/nests/${srl}/`)
      ]);
      if (!apps.success) throw 'Not found `apps`';
      if (!nest.success) throw 'Not found `nest`';

      // get apps
      return {
        srl,
        datas: {
          apps: apps.data.index || [],
          nest: nest.data || null,
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
}
</script>