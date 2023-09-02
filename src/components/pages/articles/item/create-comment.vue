<template>
<form
  ref="$comment"
  class="create-comment"
  @submit.prevent="onSubmit">
  <div class="create-comment__body">
    <FormTextarea
      ref="$form"
      v-model="forms.content.value"
      placeholder="댓글을 입력해주세요."
      :required="true"
      :auto-size="true"
      :rows="3"
      @submit="onSubmit"/>
  </div>
  <nav class="create-comment__submit">
    <div>
      <ButtonBasic
        type="submit"
        color="key"
        size="small"
        :disabled="processing"
        :icon-right="processing ? `loader` : 'check'"
        :rotate-icon="processing">
        댓글쓰기
      </ButtonBasic>
    </div>
  </nav>
</form>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { createComment } from '../../../../structure/comments'
import { err } from '../../../../libs/error'
import { toast } from '../../../../modules/toast'
import { FormTextarea } from '../../../forms'
import { ButtonBasic } from '../../../button'

const $comment = ref()
const $form = ref()
const props = defineProps({
  articleSrl: { type: Number, required: true },
})
const emits = defineEmits([ 'submit' ])
const forms = reactive({
  content: { value: '', error: null },
})
const processing = ref(false)

async function onSubmit()
{
  try
  {
    processing.value = true
    let res = await createComment(props.articleSrl, forms)
    forms.content.value = ''
    emits('submit', res)
    await nextTick()
    $form.value.changeHeight()
    window.scrollBy(0, $comment.value.getBoundingClientRect().top)
    processing.value = false
  }
  catch (e)
  {
    processing.value = false
    err(['/components/pages/articles/item/create-comment.vue', 'onSubmit()'], 'error', e.message)
    processing.value = false
    toast.add('댓글을 만들지 못했습니다.', 'error').then()
  }
}
</script>

<style src="./create-comment.scss" lang="scss" scoped></style>
