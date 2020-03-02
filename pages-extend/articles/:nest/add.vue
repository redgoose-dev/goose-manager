<template>
<article>
  <page-header module="articles" title="Articles / Add"/>
  <post
    ref="post"
    type="add"
    :srl="srl"
    :nest_srl="nest_srl"
    :category_srl="category_srl"
    :page="page"
    :skin="skin"
    :datas="datas"/>
</article>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
  name: 'page-add-article',
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'post': () => import('~/components/pages/articles/post'),
  },
  validate(cox)
  {
    return cox.params.nest && /^\d+$/.test(cox.params.nest);
  },
  /**
   * async data
   *
   * @param {object} cox
   * @return {Promise}
   * @throw {Error}
   */
  async asyncData(cox)
  {
    try
    {
      let article = {};
      const nest_srl = parseInt(cox.params.nest);
      const category_srl = cox.query.category || null;
      const page = parseInt(cox.query.page) || null;
      const [ nest, categories ] = await Promise.all([
        cox.$axios.$get(`/nests/${nest_srl}/`).then((res) => {
          return res.success ? res.data : null;
        }),
        cox.$axios
          .$get(`/categories/?nest=${nest_srl}&field=srl,name,turn&order=turn&sort=asc&strict=1`)
          .then((res) => {
            return res.success ? res.data.index.map((o) => {
              return {
                label: o.name,
                value: o.srl,
              };
            }) : [];
          }),
      ]);

      if (!nest) throw new Error('No data for `Nest`.');

      // get article
      let res_article = await cox.$axios.$get('/articles/?visible_type=ready');
      if (res_article.success && res_article.data.total > 0)
      {
        article = res_article.data.index[0];
        article.nest_srl = nest_srl;
        article.app_srl = parseInt(nest.app_srl);
        article.user_srl = parseInt(nest.user_srl);
      }
      else
      {
        let json = {
          thumbnail: { zoom: .25 },
        };
        res_article = await cox.$axios.$post('/articles/', {
          app_srl: nest.app_srl,
          nest_srl: nest.srl,
          type: 'ready',
          json: encodeURIComponent(JSON.stringify(json)),
        });
        if (res_article.success)
        {
          article = await cox.$axios.$get(`/articles/${res_article.srl}/?visible_type=ready`);
          if (article.success) article = article.data;
        }
        else
        {
          throw new Error(res_article.message);
        }
      }

      return {
        srl: parseInt(article.srl),
        nest_srl,
        category_srl,
        page,
        skin: nest.json.articleSkin || 'default',
        datas: {
          nest,
          categories,
          article,
        },
      };
    }
    catch(e)
    {
      cox.error({
        statusCode: 500,
        message: (typeof e === 'string') ? e.message : messages.error.service,
      });
    }
  },
}
</script>
