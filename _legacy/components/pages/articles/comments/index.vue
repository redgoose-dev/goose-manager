<template>
<article class="comments">
  <h3 class="comments__title">comment list</h3>
  <loading v-if="loading"/>
  <ul v-else-if="comments && comments.length" class="comments__index">
    <li v-for="(comment, key) in comments">
      <comment
        :srl="parseInt(comment.srl)"
        :user-name="comment.user_name"
        :content="comment.content"
        :regdate="comment.regdate"
        @delete="deleteComment(key)"
        @edit="(content) => editComment(key, content)"/>
    </li>
  </ul>
  <form v-if="showForm" action="#" @submit.prevent="onSubmit" ref="commentForm" class="form">
    <div class="form__body">
      <form-text
        ref="commentTextarea"
        type="textarea"
        v-model="content"
        placeholder="Please input text"
        :required="true"
        :rows="3"
        :submit-event="true"
        @submit="onSubmit"/>
    </div>
    <nav class="form__nav">
      <div>
        <button-basic
          type="submit"
          color="key"
          :disabled="processing"
          :icon-right="processing ? `loader` : ''"
          :rotate-icon="processing">
          Write Comment
        </button-basic>
      </div>
    </nav>
  </form>
</article>
</template>

<script>
import * as text from '~/libs/text';
import * as util from '~/libs/util';

export default {
  name: 'comments',
  components: {
    'comment': () => import('./comment'),
    'button-basic': () => import('~/components/button/basic'),
    'form-text': () => import('~/components/form/text'),
    'loading': () => import('~/components/etc/loading'),
  },
  props: {
    article_srl: { type: Number, default: null },
  },
  data()
  {
    return {
      content: '',
      processing: false,
      comments: [],
      loading: false,
      showForm: false,
    };
  },
  async mounted()
  {
    const { $axios } = this;
    let params = {
      article: this.article_srl,
      ext_field: 'user_name',
      unlimit: 1,
      get: 1,
    };
    this.loading = true;
    // get comments
    let comments = await $axios.$get(`/comments/${text.serialize(params, true)}`);
    if (comments.success)
    {
      this.comments = comments.data.index;
    }
    else
    {
      this.comments = [];
    }
    this.loading = false;
    this.showForm = true;
  },
  methods: {
    async onSubmit()
    {
      const { $axios } = this;
      const $form = this.$refs.commentForm;
      const $textarea = this.$refs.commentTextarea;
      try
      {
        // check content
        if (!(this.content.length > 1)) throw 'Please write at least 2 characters.';
        // request
        this.processing = true;
        let result = await $axios.$post(`/comments/`, {
          content: this.content,
          article_srl: this.article_srl,
          get: 1,
        });
        if (!result.success) throw result.message;
        let comment = await $axios.$get(`/comments/${result.srl}/?ext_field=user_name`);
        if (!comment.success) throw comment.message;
        this.comments.push({
          ...comment.data,
          content: comment.data.content,
        });
        this.content = '';
        await util.sleep(100);
        $textarea.changeHeight();
        window.scrollBy(0, $form.getBoundingClientRect().top);
        this.processing = false;
      }
      catch(e)
      {
        this.processing = false;
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed add comment.`,
          color: 'error'
        });
        $textarea.focus();
      }
    },
    deleteComment(key)
    {
      this.comments.splice(key, 1);
    },
    editComment(key, content)
    {
      this.comments[key].content = content;
    },
  },
}
</script>

<style src="./index.scss" lang="scss" scoped/>
