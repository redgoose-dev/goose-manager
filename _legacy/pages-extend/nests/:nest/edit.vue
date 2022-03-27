<template>
<article>
  <page-header module="nests" title="Nests / Edit"/>
  <post type="edit" :srl="srl" redirect-url="../../" :datas="datas" />
</article>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'post': () => import('~/components/pages/nests/post'),
  },
  validate(context)
  {
    return context.params.nest && /^\d+$/.test(context.params.nest);
  },
  async asyncData(context)
  {
    try
    {
      let srl = parseInt(context.params.nest);
      const [ apps, nest ] = await Promise.all([
        context.$axios.$get('/apps/?field=srl,id,name&strict=1'),
        context.$axios.$get(`/nests/${srl}/`)
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
      context.error({
        statusCode: 500,
        message: (typeof e === 'string') ? e : messages.error.service,
      });
    }
  },
}
</script>
