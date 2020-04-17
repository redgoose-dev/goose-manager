<template>
<article>
  <page-header module="articles" title="Articles / Change Nest"/>

  <form @submit.prevent="submit" ref="form">
    <item-list
      :image="computedArticleImage"
      :title="article.title"
      :alt="article.title"
      :description="computedArticleDescription"
      :metas="computedArticleMetas"/>

    <!-- form body -->
    <field-wrap :legend="`change nest form body`" :hide-legend="true">
      <field label="Nest" for="nest_srl">
        <template slot="body">
          <form-select
            name="nest_srl"
            id="nest_srl"
            v-model="forms.nest_srl"
            :options="computedNestsForSelectBox"
            :required="true"
            :inline="true"
            :placeholder="null"/>
        </template>
      </field>
    </field-wrap>
    <!-- // form body -->

    <!-- bottom buttons -->
    <nav-bottom>
      <template slot="left">
        <button-basic type="button" icon-left="arrow-left" @click="$router.back()">Back</button-basic>
      </template>
      <template slot="right">
        <button-basic
          type="submit"
          color="key"
          :icon-left="processing ? 'loader' : 'check'"
          :rotate-icon="processing"
          :disabled="processing">
          Change nest
        </button-basic>
      </template>
    </nav-bottom>
    <!-- // bottom buttons -->
  </form>
</article>
</template>

<script>
import marked from 'marked';
import * as messages from "~/libs/messages";
import * as text from "~/libs/text";
import * as dates from '~/libs/dates';
import * as fieldset from '~/components/form/fieldset';
import { formData } from '~/libs/forms';

export default {
  name: 'article-change-nest',
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'field-wrap': fieldset.wrap,
    'field': fieldset.field,
    'form-select': () => import('~/components/form/select'),
    'button-basic': () => import('~/components/button/basic'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'item-list': () => import('~/components/item/list'),
  },
  validate(cox)
  {
    return cox.params.article && /^\d+$/.test(cox.params.article);
  },
  async asyncData(cox)
  {
    const { store, $axios } = cox;
    const article_srl = parseInt(cox.params.article);
    let url__nest_srl = cox.params.nest ? parseInt(cox.params.nest) : null;

    try
    {
      // get article
      let params = {
        field: 'srl,app_srl,nest_srl,category_srl,title,content,json,order,regdate',
        ext_field: 'category_name,nest_name',
        visible_type: 'all',
      };
      let article = await $axios.$get(`/articles/${article_srl}/${text.serialize(params, true)}`);
      if (!article.success) throw new Error(article.message);
      article = article.data;
      if (!article.nest_srl) throw new Error('Invalid article.');

      // set values
      let nest_srl = parseInt(article.nest_srl);
      let category_srl = article.category_srl || 'null';

      // get nests
      params = { unlimit: 1, field: 'srl,app_srl,user_srl,id,name,json', ext_field: 'app_name' };
      if (!store.state.authUser.admin) params.user = store.state.authUser.srl;
      let nests = await $axios.$get(`/nests/${text.serialize(params, true)}`);
      if (!nests.success) throw new Error(nests.message);
      nests = nests.data ? nests.data.index : [];

      // get nest
      let nest = null;
      nests.forEach((item, key) => {
        if (parseInt(item.srl) === nest_srl) nest = item;
      });

      return {
        processing: false,
        processingBody: false,
        article_srl: article_srl,
        article,
        nests,
        nest,
        forms: { nest_srl, category_srl },
        original: { nest_srl, category_srl },
        url__nest_srl,
      };
    }
    catch(e)
    {
      cox.error({
        statusCode: 500,
        message: e.message ? e.message : messages.error.service,
      });
    }
  },
  computed: {
    computedNestsForSelectBox()
    {
      return this.nests.map((item, key) => ({
        label: `${item.app_name} - [${item.id}] ${item.name}`,
        value: parseInt(item.srl),
      }));
    },
    computedArticleImage()
    {
      const { thumbnail } = this.article.json;
      return (thumbnail && thumbnail.path) ? `${this.$store.state.url_api}/${thumbnail.path}` : null;
    },
    computedArticleDescription()
    {
      let content = marked(this.article.content);
      content = content.replace(/(<([^>]+)>)/ig, '');
      content = content.substring(0, 75);
      return content;
    },
    computedArticleMetas()
    {
      const { preference } = this.$store.state;
      return [
        `Nest: ${this.article.nest_name}`,
        this.article.category_name && `Category: ${this.article.category_name}`,
        dates.convertDateInService(this.article, preference.articles.displayDateField),
      ];
    },
  },
  watch: {
    'forms.nest_srl': async function(newValue)
    {
      this.processingBody = true;
      // change nest
      let nest = null;
      this.nests.forEach((item, key) => {
        if (item.srl === newValue) nest = item;
      });
      this.nest = nest;
      // set category_srl
      this.forms.category_srl = (this.original.nest_srl === parseInt(newValue)) ? this.original.category_srl : 'null';
      this.processingBody = false;
    },
  },
  methods: {
    async submit()
    {
      const { url__nest_srl, article_srl, $router, forms } = this;
      const { preference } = this.$store.state;
      try
      {
        this.processing = true;
        let res = await this.$axios.$post(
          `/articles/${article_srl}/change-nest/`,
          formData({
            nest_srl: forms.nest_srl,
            category_srl: forms.category_srl,
          })
        );
        if (!res.success) throw new Error(res.message);
        let url = url__nest_srl ? `../../../../${forms.nest_srl}/articles/${article_srl}/` : '../';
        $router.push(url);
      }
      catch(e)
      {
        if (preference.debug.service) console.error(e);
        this.processing = false;
        this.$toast.add({
          message: `Failed change nest from article.`,
          color: 'error',
        });
      }
    },
  },
}
</script>
