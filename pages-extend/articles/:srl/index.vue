<template>
<article class="article">
  <header class="article-header">
    <small>{{computedPrefix}}</small>
    <h2>{{article.title}}</h2>
    <p>{{computedDescription}}</p>
  </header>

  <div class="article__body">
    <div v-html="article.content" class="redgoose-body"/>
  </div>

  <article v-if="files && files.length" class="files">
    <h3>Attachment files</h3>
    <ul>
      <li v-for="(file,key) in files" :key="file.srl">
        <a :href="`${$store.state.url_api}/${file.loc}`" target="_blank">
          <span>{{file.name}}</span>
          <em>{{getFileSize(file.size)}}</em>
        </a>
      </li>
    </ul>
  </article>

  <nav-bottom>
    <template slot="left">
      <button-basic icon-left="list" :to="makeButtonUrl('index')">Index</button-basic>
    </template>
    <template slot="right">
      <button-basic v-if="nest_srl" :to="makeButtonUrl('add')">Add</button-basic>
      <button-basic :to="makeButtonUrl('edit', srl)" icon-left="edit-3" color="key">Edit</button-basic>
      <button-basic :to="makeButtonUrl('delete', srl)" icon-left="trash" color="gray">Delete</button-basic>
    </template>
  </nav-bottom>
</article>
</template>

<script>
import marked from 'marked';
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';
import * as text from '~/libs/text';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'button-basic': () => import('~/components/button/basic'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
  },
  validate(context)
  {
    return context.params.article && /^\d+$/.test(context.params.article);
  },
  async asyncData(context)
  {
    try
    {
      const srl = parseInt(context.params.article);
      const nest_srl = context.query.nest || null;
      const category_srl = context.query.category || null;
      const page = context.query.page || null;
      const article = await context.$axios.$get(`/articles/${srl}/?ext_field=category_name&visible_type=all`);
      if (!article.success) throw article.message;

      // get nest, category data
      const [ nest, category, files ] = await Promise.all([
        context.$axios.$get(`/nests/${article.data.nest_srl}/`),
        article.data.category_srl && context.$axios.$get(`/categories/${article.data.category_srl}/`),
        context.$axios.$get(`/files/?article=${srl}`)
      ]);
      if (!nest.success) throw nest.message;

      // convert content
      article.data.content = marked(article.data.content);

      return {
        srl,
        nest_srl,
        category_srl,
        page,
        article: article.data,
        nest: nest.data,
        category: (category && category.success) ? category.data : null,
        files: (files && files.success) ? files.data.index : null,
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
  computed: {
    computedDescription()
    {
      let src = [
        `${text.getArticleType(this.article.type)}`,
        `regdate: ${dates.getFormatDate(this.article.regdate, false)}`,
      ];
      if (this.article.order) src.push(`order: ${this.article.order}`);
      src.push(`hit: ${this.article.hit}`);
      src.push(`like: ${this.article.star}`);
      return src.join(', ');
    },
    computedPrefix()
    {
      let str = '';
      str += this.nest.name;
      str += (this.article.category_name) ? ` / ${this.article.category_name}` : '';
      return str;
    }
  },
  methods: {
    makeButtonUrl(type, srl=null)
    {
      let query = {};
      if (this.category_srl) query.category = this.category_srl;
      if (this.page && this.page > 1) query.page = this.page;
      switch(type)
      {
        case 'index':
          return `../${text.serialize(query, true)}`;
        case 'add':
          return `../${this.nest_srl}/add/${text.serialize(query, true)}`;
        case 'edit':
          if (this.nest_srl) query.nest = this.nest_srl;
          return `../${srl}/edit/${text.serialize(query, true)}`;
        case 'delete':
          if (this.nest_srl) query.nest = this.nest_srl;
          return `../${srl}/delete/${text.serialize(query, true)}`;
      }
    },
    getFileSize(size)
    {
      return text.getFileSize(size);
    }
  },
}
</script>

<style src="./index.scss" lang="scss" scoped/>
