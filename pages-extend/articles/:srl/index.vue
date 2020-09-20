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
        <img
          :src="previewImage"
          alt=""
          class="preview-image__source"
          @click="(e) => e.stopPropagation()">
      </figure>
    </div>
  </transition>
</article>
</template>

<script>
import marked from 'marked';
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
      if (!article.success) throw article.message;

      // get nest, category data
      const [ nest, category, files ] = await Promise.all([
        $axios.$get(`/nests/${article.data.nest_srl}/`),
        article.data.category_srl && $axios.$get(`/categories/${article.data.category_srl}/`),
        $axios.$get(`/files/?target=${srl}&module=articles`),
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
        useComment: (nest.data && nest.data.json && parseInt(nest.data.json.useComment) === 1),
        previewImage: null,
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
      const $gridImages = $body.querySelectorAll('.grid-item img');
      $gridImages.forEach((o,k) => {
        o.addEventListener('click', (e) => {
          this.previewImage = e.target.src;
        });
      });
    },
  },
}
</script>

<style src="./index.scss" lang="scss" scoped/>
<style lang="scss">
@import "../../../assets/scss/variables";
@import "../../../assets/scss/mixins";
.redgoose-body {
  .grid-item {
    --grid-item-columns: 4;
    --grid-item-gap: 10px;
    display: grid;
    grid-template-columns: repeat(var(--grid-item-columns), 1fr);
    grid-gap: var(--grid-item-gap);
    margin: calc(var(--size-margin-vertical)*2.5) auto var(--size-margin-vertical);
    width: 100%;
    > p {
      position: relative;
      margin: 0;
      box-sizing: border-box;
      padding-top: 100%;
      > img {
        position: absolute;
        margin: 0;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        max-width: none;
        max-height: none;
        transform: none;
        box-sizing: border-box;
        object-fit: cover;
        cursor: pointer;
        transition: opacity 200ms ease-out;
        &:active {
          opacity: .5;
        }
      }
    }
    @for $i from 2 through 12 {
      &[data-mobile="#{$i}"] { --grid-item-columns: #{$i}; }
    }
    @include responsive(tablet) {
      @for $i from 2 through 12 {
        &[data-tablet="#{$i}"] { --grid-item-columns: #{$i}; }
      }
    }
    @include responsive(desktop) {
      @for $i from 2 through 12 {
        &[data-desktop="#{$i}"] { --grid-item-columns: #{$i}; }
      }
    }
    @include responsive(desktop-large) {
      @for $i from 2 through 12 {
        &[data-desktop-large="#{$i}"] { --grid-item-columns: #{$i}; }
      }
    }
  }
  .grid-group {
    margin: calc(var(--size-margin-vertical)*2.5) auto var(--size-margin-vertical);
    > .grid-item {
      margin-top: var(--grid-item-gap);
      margin-bottom: var(--grid-item-gap);
      &:first-child {
        margin-top: 0;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
