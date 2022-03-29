<template>
<article>
  <page-header module="categories" title="Categories / Edit"/>
  <post
    type="edit"
    :srl="srl"
    :nest_srl="nest_srl"
    :data="forms"/>
</article>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'post': () => import('~/components/pages/categories/post'),
  },
  validate(context)
  {
    // check srl
    if (!(context.params.category && /^\d+$/.test(context.params.category))) return false;
    // check nest_srl
    return context.params.nest && /^\d+$/.test(context.params.nest);
  },
  async asyncData(context)
  {
    try
    {
      let srl = parseInt(context.params.category);
      let nest_srl = parseInt(context.params.nest);
      let res = await context.$axios.$get(`/categories/${srl}/`);
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
      context.error({
        statusCode: 500,
        message: (typeof e === 'string') ? e : messages.error.service,
      });
    }
  },
}
</script>
