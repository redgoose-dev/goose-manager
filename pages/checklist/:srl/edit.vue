<template>
<article>
  <page-header module="checklist" title="Checklist / Edit item"/>
  <post :datas="datas"/>
</article>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
  name: 'page-checklist-edit-item',
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'post': () => import('~/components/pages/checklist/post'),
  },
  async asyncData(context)
  {
    const { params, $axios, error } = context;
    try
    {
      let res = await $axios.$get(`/checklist/${Number(params.srl)}/`);
      if (!res.success) throw res.message;
      return {
        datas: {
          srl: Number(res.data.srl),
          regdate: res.data.regdate,
          content: res.data.content,
        },
      };
    }
    catch(e)
    {
      error({
        statusCode: 500,
        message: (typeof e === 'string') ? e : messages.error.service,
      });
    }
  },
}
</script>
