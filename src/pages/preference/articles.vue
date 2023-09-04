<template>
<article>
  <header class="section-header">
    <h1 class="section-header__title">Articles</h1>
    <p class="section-header__description">
      아티클 모듈에 관한 설정입니다.
    </p>
  </header>
  <form class="code-form" @submit.prevent="onSubmit">
    <fieldset class="code-form__fieldset">
      <legend>Articles forms</legend>
      <div class="field">
        <div class="content-editor">
          <ToolbarWrap>
            <template #right>
              <ToolbarGroup>
                <ToolbarItem
                  type="button"
                  title="Editor"
                  label="에디터"
                  icon="server"
                  :color="mode === 'editor' ? 'key' : ''"
                  :disabled="mode === 'editor'"
                  @click="mode = 'editor'"/>
                <ToolbarItem
                  type="button"
                  title="Source code"
                  label="소스코드"
                  icon="code"
                  :color="mode === 'source' ? 'key' : ''"
                  :disabled="mode === 'source'"
                  @click="mode = 'source'"/>
              </ToolbarGroup>
            </template>
          </ToolbarWrap>
          <div class="content-editor__body">
            <JsonEditor
              v-if="mode === 'editor'"
              ref="$jsonEditor"
              v-model="fields.code.value"
              @init="onInitJsonEditor"/>
            <template v-else>
              <FormTextarea
                v-model="fields.code.value"
                placeholder="Please input code"
                :auto-size="false"
                :rows="16"
                @submit="onSubmit"/>
              <Help>JSON 형식의 소스코드이니 코드 작성에 주의해 주세요.</Help>
            </template>
          </div>
        </div>
      </div>
    </fieldset>
    <Controller>
      <template #right>
        <ButtonBasic type="submit" icon-left="check" color="key">
          적용하기
        </ButtonBasic>
      </template>
    </Controller>
  </form>
</article>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { preferenceStore } from '../../store/preference'
import { validateForms, getStringJson } from './libs'
import { toast } from '../../modules/toast'
import { err } from '../../libs/error'
import { FormTextarea } from '../../components/forms'
import { Help } from '../../components/forms/fieldset'
import { Controller } from '../../components/navigation'
import { ButtonBasic } from '../../components/button'
import { ToolbarWrap, ToolbarGroup, ToolbarItem } from '../../components/navigation/toolbar'
import JsonEditor from '../../components/json-editor/index.vue'

const $jsonEditor = ref()
const preference = preferenceStore()
const fields = reactive({
  code: {
    value: getStringJson(preference.articles),
    error: null,
  },
})
const mode = ref('editor')

async function onSubmit()
{
  try
  {
    validateForms(fields.code.value)
    preference.articles = {
      ...(JSON.parse(fields.code.value)),
    }
    await preference.save()
    toast.add('환경설정을 수정했습니다.', 'success').then()
  }
  catch (e)
  {
    err(['/pages/preference/articles.vue', 'onSubmit()'], 'error', e.message)
    toast.add('환경설정을 수정하지 못했습니다.', 'error').then()
  }
}

function onInitJsonEditor()
{
  $jsonEditor.value.expandFolder(3)
}
</script>

<style src="./common.scss" lang="scss" scoped></style>
