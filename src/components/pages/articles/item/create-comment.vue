<template>
<form
  ref="$comment"
  class="create-comment"
  @submit.prevent="onSubmit">
  <div class="create-comment__body">
    <FormTextarea
      ref="$form"
      v-model="forms.content.value"
      :placeholder="printf(message.words.pleaseInput, message.word.comment)"
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
        {{message.word.writeComment}}
      </ButtonBasic>
    </div>
  </nav>
</form>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue'
import { createComment } from '../../../../structure/comments'
import { printf } from '../../../../libs/string'
import { err } from '../../../../libs/error'
import { message } from '../../../../message'
import { toast } from '../../../../modules/toast'
import { FormTextarea } from '../../../forms'
import { ButtonBasic } from '../../../button'

const $comment = ref<any>()
const $form = ref<any>()
const props = defineProps<{
  articleSrl: number
}>()
const emits = defineEmits([ 'submit' ])
const forms = reactive<any>({
  content: { value: '', error: null },
})
const processing = ref<boolean>(false)

async function onSubmit(): Promise<void>
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
  catch (e: any)
  {
    processing.value = false
    err(['/components/pages/articles/item/create-comment.vue', 'onSubmit()'], 'error', e.message)
    processing.value = false
    toast.add(printf(message.fail.create, message.word.comment), 'error').then()
  }
}
</script>

<style src="./create-comment.scss" lang="scss" scoped></style>
