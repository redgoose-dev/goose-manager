<template>
<article>
  <page-header module="categories" title="Edit category"/>
  <post type="edit" :srl="srl" :nest_srl="nest_srl" :data="forms"/>
</article>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'post': () => import('~/components/pages/categories/post'),
  },
  validate(cox)
  {
    // check srl
    if (!(cox.params.srl && /^\d+$/.test(cox.params.srl))) return false;
    // check nest_srl
    return cox.query.nest && /^\d+$/.test(cox.query.nest);
  },
  async asyncData(cox)
  {
    try
    {
      let srl = parseInt(cox.params.srl);
      let nest_srl = parseInt(cox.query.nest);
      let res = await cox.$axios.$get(`/categories/${srl}/`);
      return {
        srl,
        nest_srl,
        forms: {
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
}
</script>