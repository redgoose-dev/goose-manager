<template>
<form ref="$root" @submit.prevent="onSubmit">
  <Fieldset :disabled="state.loading">
    <Field label="이름" for="post-name">
      <FormInput
        v-model="forms.name.value"
        name="post-name"
        id="post-name"
        :maxlength="42"
        placeholder="이름을 입력해주세요."
        :required="true"
        class="fields__name"/>
    </Field>
  </Fieldset>
  <Controller>
    <template #left>
      <ButtonBasic
        type="button"
        icon-left="arrow-left"
        @click="router.back()">
        뒤로가기
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic
        type="submit"
        color="key"
        :icon-left="state.processing ? 'loader' : 'check'"
        :rotate-icon="state.processing">
        {{_submitLabel}}
      </ButtonBasic>
    </template>
  </Controller>
</form>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { getData, submit } from '../../../structure/category/post.js'
import { Fieldset, Field } from '../../forms/fieldset/index.js'
import { FormInput } from '../../forms/index.js'
import { Controller } from '../../navigation/index.js'
import { ButtonBasic } from '../../button/index.js'

const router = useRouter()
const toast = inject('toast')
const error = inject('error')
const $root = ref()
const props = defineProps({
  mode: { type: String, required: true },
  srl: Number,
  module: String,
  moduleSrl: Number,
})
const emits = defineEmits( [ 'submit' ])
const state = reactive({
  loading: props.mode === 'edit',
  processing: false,
})
const forms = reactive({
  module: { value: props.module },
  moduleSrl: { value: props.moduleSrl },
  name: { value: '', error: null },
})
const errorPath = [ 'components', 'pages', 'category', 'post.vue' ]

const _isEdit = computed(() => (props.mode === 'edit'))
const _submitLabel = computed(() => {
  return _isEdit.value ? '분류 수정하기' : '분류 만들기'
})

onMounted(async () => {
  if (!_isEdit.value) return
  try
  {
    const { name } = await getData(props.srl)
    forms.name.value = name
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '데이터를 가져오지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.loading = false
  }
})

async function onSubmit()
{
  try
  {
    state.processing = true
    await submit(props.srl, forms)
    const message = _isEdit.value ? '분류를 수정했습니다.' : '분류를 만들었습니다.'
    toast.add(message, 'success').then()
    emits('submit')
  }
  catch (e)
  {
    const message = _isEdit.value ? '분류를 수정하지 못했습니다.' : '분류를 만들지 못했습니다.'
    error.catch({
      path: [ ...errorPath, 'onSubmit()' ],
      message,
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}
</script>

<style lang="scss" scoped>
.fields {
  &__name {
    --input-width: 360px;
  }
}
</style>
