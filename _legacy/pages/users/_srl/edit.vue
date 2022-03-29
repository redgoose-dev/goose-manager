<template>
<article>
  <page-header module="users" title="Users / Edit"/>
  <post type="edit" :datas="datas"/>
</article>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'post': () => import('~/components/pages/users/post'),
  },
  validate(cox)
  {
    return cox.params.srl && /^\d+$/.test(cox.params.srl);
  },
  async asyncData(context)
  {
    try
    {
      let srl = parseInt(context.params.srl);
      let res = await context.$axios.$get(`/users/${srl}/`);
      if (!res.success) throw res.message;
      return {
        datas: {
          srl: res.data.srl,
          email: res.data.email,
          name: res.data.name,
          admin: res.data.admin,
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
