<template>
<div class="comment">
  <div v-if="mode === 'edit'" class="comment__body">
    <form action="#" @submit.prevent="onSubmitEdit" ref="commentForm" class="edit-form">
      <div class="edit-form__body">
        <form-text
          ref="commentTextarea"
          type="textarea"
          v-model="editContent"
          placeholder="Please input text"
          :required="true"
          :rows="2"/>
      </div>
      <nav class="edit-form__nav">
        <div>
          <button-basic size="small" @click="closeEdit">Cancel</button-basic>
        </div>
        <div>
          <button-basic
            type="submit"
            size="small"
            color="key"
            :disabled="processing"
            :icon-right="processing ? `loader` : ''"
            :rotate-icon="processing">
            Edit Comment
          </button-basic>
        </div>
      </nav>
    </form>
  </div>
  <div v-else class="comment__body">
    <article v-html="computedContent" class="redgoose-body redgoose-body--dark"/>
  </div>
  <div class="comment__bottom">
    <p><strong>{{userName}}</strong> commented <em>{{regdate}}</em></p>
    <nav>
      <span>
        <button
          type="button"
          class="edit"
          :disabled="mode === 'edit'"
          @click="onClickEdit">
          Edit
        </button>
      </span>
      <span>
        <button type="button" class="delete" @click="onClickDelete(srl)">Delete</button>
      </span>
    </nav>
  </div>
</div>
</template>

<script>
import marked from "marked";

export default {
  name: 'comment',
  components: {
    'form-text': () => import('~/components/form/text'),
    'button-basic': () => import('~/components/button/basic'),
  },
  props: {
    srl: { type: Number, default: null },
    userName: { type: String, default: 'anonymous' },
    content: { type: String, default: null },
    regdate: { type: String, default: null },
  },
  data()
  {
    return {
      mode: null, // null,edit
      editContent: '',
      processing: false,
    };
  },
  computed: {
    computedContent()
    {
      return marked(this.content);
    },
  },
  methods: {
    onClickEdit()
    {
      this.mode = 'edit';
      this.editContent = this.content;
      this.$emit('open-edit');
    },
    async onClickDelete(srl)
    {
      if (confirm('Do you really want to delete it?'))
      {
        try
        {
          let result = await this.$axios.$post(`/comments/${srl}/delete/`);
          if (!result.success) throw new Error(result.message);
          this.$emit('delete');
        }
        catch(e)
        {
          this.$toast.add({
            message: (e && typeof e === 'string') ? e : `Failed delete comment.`,
            color: 'error',
          });
        }
      }
    },
    async onSubmitEdit()
    {
      try
      {
        this.processing = true;
        await this.$axios.$post(`/comments/${this.srl}/edit/`, {
          content: this.editContent,
        });
        this.$emit('edit', this.editContent);
      }
      catch(e)
      {
        this.$toast.add({
          message: `Failed edit comment.`,
          color: 'error'
        });
      }
      this.closeEdit();
    },
    closeEdit()
    {
      this.mode = null;
      this.editContent = '';
      this.processing = false;
    },
  },
}
</script>

<style src="./comment.scss" lang="scss" scoped/>
