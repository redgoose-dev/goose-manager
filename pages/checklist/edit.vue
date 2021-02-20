<template>
<article>
  <page-header module="checklist" title="Checklist / Edit"/>
  <post :datas="datas"/>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import { getLastItem } from '~/components/pages/checklist/src';

export default {
  name: 'page-checklist-edit',
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'post': () => import('~/components/pages/checklist/post'),
  },
  async asyncData(context)
  {
    const { store, $axios, error } = context;
    const { preference } = store.state;

    try
    {
      let res = await getLastItem($axios, preference.checklist.reset);
      if (!res) throw 'not found item';
      return {
        datas: {
          srl: Number(res.srl),
          regdate: res.regdate,
          content: res.content,
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
