<template>
<article class="article">
  <header class="article-header">
    <small>{{computedPrefix}}</small>
    <h2>{{article.title}}</h2>
    <p>{{computedDescription}}</p>
  </header>

  <div class="article__body">
    <div ref="articleBody" v-html="article.content" class="redgoose-body redgoose-body--dark"/>
  </div>

  <article v-if="files && files.length" class="files article__files">
    <h3>Attachment files</h3>
    <ul>
      <li v-for="(file,key) in files" :key="file.srl">
        <a :href="`${$store.state.url_api}/${file.path}`" target="_blank">
          <span>{{file.name}}</span>
          <em>{{getFileSize(file.size)}}</em>
        </a>
      </li>
    </ul>
  </article>

  <nav-bottom>
    <template slot="left">
      <button-basic :href="makeButtonUrl('index')" icon-left="list">Index</button-basic>
    </template>
    <template slot="right">
      <button-basic v-if="nest_srl" :href="makeButtonUrl('add')">Add</button-basic>
      <button-basic :href="makeButtonUrl('change-nest')">Change nest</button-basic>
      <button-basic :href="makeButtonUrl('edit')" icon-left="edit-3" color="key">Edit</button-basic>
      <button-basic :href="makeButtonUrl('delete')" icon-left="trash" color="gray">Delete</button-basic>
    </template>
  </nav-bottom>

  <comments v-if="useComment" :article_srl="srl"/>

  <transition name="preview-image">
    <div v-if="!!previewImage" class="preview-image" @click="previewImage = null">
      <figure class="preview-image__body">
        <img :src="previewImage" alt="" class="preview-image__source">
      </figure>
    </div>
  </transition>
</article>
</template>

<script>
import { marked } from 'marked';
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';
import * as text from '~/libs/text';

export default {
  name: 'page-article',
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'button-basic': () => import('~/components/button/basic'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'comments': () => import('~/components/pages/articles/comments'),
  },
  validate(context)
  {
    return context.params.article && /^\d+$/.test(context.params.article);
  },
  async asyncData(context)
  {
    const { params, query, $axios, error } = context;
    try
    {
      const srl = parseInt(params.article);
      const nest_srl = params.nest || null;
      const category_srl = query.category || null;
      const page = query.page || null;
      const article = await $axios.$get(`/articles/${srl}/?ext_field=category_name&visible_type=all`);
      if (!article?.success) throw new Error(article?.message);

      // get nest, category data
      const [ nest, category, files ] = await Promise.all([
        $axios.$get(`/nests/${article.data.nest_srl}/`),
        article.data.category_srl && $axios.$get(`/categories/${article.data.category_srl}/`),
        $axios.$get(`/files/?target=${srl}&module=articles`),
      ]);
      if (!nest.success) throw new Error(nest.message);

      // convert content
      article.data.content = marked(article.data.content);

      return {
        srl,
        nest_srl,
        category_srl,
        page,
        article: article?.data,
        nest: nest.data,
        category: (category && category.success) ? category.data : null,
        files: (files && files.success) ? files.data.index : null,
        useComment: (nest.data && nest.data.json && parseInt(nest.data.json.useComment) === 1),
        previewImage: null,
      };
    }
    catch(e)
    {
      error({
        statusCode: 500,
        message: e.message || messages.error.service,
      });
    }
  },
  computed: {
    computedDescription()
    {
      let src = [
        `${text.getArticleType(this.article?.type)}`,
        `regdate: ${dates.getFormatDate(this.article.regdate, false)}`,
      ];
      if (this.article.order) src.push(`order: ${this.article.order}`);
      src.push(`hit: ${this.article.hit}`);
      src.push(`like: ${this.article.star}`);
      return src.join(', ');
    },
    computedPrefix()
    {
      let str = this.nest.name;
      str += (this.article.category_name) ? ` / ${this.article.category_name}` : '';
      return str;
    }
  },
  watch: {
    previewImage: function(newValue)
    {
      if (!document) return false;
      const $html = document.querySelector('html');
      newValue ? $html.classList.add('popup-modal-basic') : $html.classList.remove('popup-modal-basic');
    },
  },
  mounted()
  {
    this.initContentBody();
  },
  methods: {
    makeButtonUrl(type)
    {
      let query = {};
      if (this.category_srl) query.category = this.category_srl;
      if (this.page && this.page > 1) query.page = this.page;
      switch(type)
      {
        case 'index':
          return `../${text.serialize(query, true)}`;
        case 'add':
          return `../add/${text.serialize(query, true)}`;
        case 'edit':
          return `./edit/${text.serialize(query, true)}`;
        case 'change-nest':
          return `./change-nest/${text.serialize(query, true)}`;
        case 'delete':
          return `./delete/${text.serialize(query, true)}`;
      }
    },
    getFileSize(size)
    {
      return text.getFileSize(size);
    },
    initContentBody()
    {
      const $body = this.$refs.articleBody;
      // set grid images
      const $gridImages = $body.querySelectorAll('img');
      $gridImages.forEach(o => {
        o.addEventListener('click', e => {
          this.previewImage = e.target.src;
        });
      });
    },
  },
}
</script>

<style src="./index.scss" lang="scss" scoped/>
