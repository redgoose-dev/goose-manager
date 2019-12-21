<template>
<article>
  <page-header module="apps" title="Apps / Edit"/>
  <post type="edit" :srl="srl" :data="forms"/>
</article>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'post': () => import('~/components/pages/apps/post'),
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
      let res = await cox.$axios.$get(`/apps/${srl}/`);
      if (!res.success) throw res.message;
      return {
        srl,
        forms: {
          id: res.data.id,
          name: res.data.name,
          description: res.data.description,
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
}
</script>
