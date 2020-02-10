<template>
<article>
  <page-header module="articles" title="Articles / Edit"/>
  <post
    type="edit"
    :srl="srl"
    :nest_srl="nest_srl"
    :category_srl="category_srl"
    :page="page"
    :skin="'default'"
    :datas="datas"/>
</article>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'post': () => import('~/components/pages/articles/post'),
  },
  validate(cox)
  {
    return cox.params.article && /^\d+$/.test(cox.params.article);
  },
  async asyncData(cox)
  {
    const srl = cox.params.article;
    const nest_srl = cox.query.nest || null;
    const category_srl = cox.query.category || null;
    const page = cox.query.page || null;

    try
    {
      // get article
      let article = await cox.$axios.$get(`/articles/${srl}/?ext_field=category_name&visible_type=all`);
      if (!article.success) throw article.message;
      article = article.data;
      if (!article.nest_srl) throw 'Invalid article.';

      // get nest, categories
      const [ nest, categories, files ] = await Promise.all([
        cox.$axios.$get(`/nests/${article.nest_srl}/`).then((res) => {
          return res.success ? res.data : null;
        }),
        cox.$axios.$get(`/categories/?nest=${article.nest_srl}&field=srl,name,turn&order=turn&sort=asc`).then((res) => {
          return res.success ? res.data.index : [];
        }),
        cox.$axios.$get(`/files/?target=${srl}&module=articles&strict=1`),
      ]);

      return {
        srl,
        nest_srl,
        category_srl,
        page,
        skin: null,
        datas: {
          article,
          nest,
          categories: categories.map((o) => ({ label: o.name, value: o.srl })),
          files: (files.success && files.data.index.length) ? files.data.index.map((o) => {
            return {
              id: parseInt(o.srl),
              srl: parseInt(o.srl),
              name: o.name,
              size: parseInt(o.size),
              src: `${o.path}`,
              type: o.type,
              ready: parseInt(o.ready),
            };
          }) : null
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
  }
}
</script>
