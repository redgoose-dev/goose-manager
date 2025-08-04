<template>
<article>
  <Loading v-if="state.loading"/>
  <template v-else-if="state.tokens.length > 0">
    <p class="token-total">
      총 <strong>{{state.tokens.length}}개</strong>의 공개 토큰이 등록되어 있습니다.
    </p>
    <ul class="tokens">
      <li v-for="(o,k) in state.tokens" class="token">
        <dl class="body">
          <dt>
            <label :for="`access-token_${k}`">엑세스 토큰</label>
          </dt>
          <dd>
            <FormKeyword
              :model-value="o.accessToken"
              :id="`access-token_${k}`"
              :readonly="true"
              :use-submit="true"
              icon-submit="clipboard"
              class="access-token"
              @submit="copyTokenToClipboard(o.accessToken)"
              @click-input="$event.target.select()"/>
          </dd>
          <dt>설명</dt>
          <dd>
            <p class="description">{{o.description}}</p>
          </dd>
          <dd class="meta">
            <span>{{o.provider}}</span>
            <span>{{o.regdate}}</span>
          </dd>
        </dl>
        <nav>
          <ButtonIcon
            type="button"
            title="수정"
            icon-name="edit"
            color="transparent"
            class="button-edit"
            @click="controlPostToken(true, o)"/>
          <ButtonIcon
            type="button"
            title="만료"
            icon-name="trash-2"
            color="transparent"
            class="button-delete"
            @click="onClickDeleteToken(o.srl, k)"/>
        </nav>
      </li>
    </ul>
  </template>

  <Empty v-else title="no data"/>
  <Controller>
    <template #right>
      <ButtonBasic
        color="key"
        icon-left="key-round"
        @click="controlPostToken(true)">
        공개 토큰 만들기
      </ButtonBasic>
    </template>
  </Controller>
  <teleport to="#modals">
    <Modal
      :open="state.postToken.open"
      :scroll="true"
      :shortcut="true"
      @close="controlPostToken(false)">
      <ModalWindow
        class="post-provider-window">
        <PostToken
          :data="state.postToken.data"
          @submit="onSubmitPostToken"
          @close="controlPostToken(false)"/>
      </ModalWindow>
    </Modal>
  </teleport>
</article>
</template>

<script setup>
import { reactive, onMounted, inject } from 'vue'
import { getIndex, deleteToken } from '../../../structure/auth/token.js'
import { copyToClipboard } from '../../../libs/util.js'
import { Loading, Empty } from '../../../components/content/index.js'
import { Controller } from '../../../components/navigation/index.js'
import { ButtonBasic, ButtonIcon } from '../../../components/button/index.js'
import { FormKeyword } from '../../../components/forms/index.js'
import { Modal, ModalWindow } from '../../../components/modal/index.js'
import PostToken from '../../../components/pages/auth/post-token.vue'

const toast = inject('toast')
const auth = inject('auth')
const error = inject('error')
const errorPath = [ 'pages', 'auth', 'account', 'token.vue' ]
const state = reactive({
  loading: true,
  tokens: [],
  postToken: {
    open: false,
    data: null,
  },
})

onMounted(_fetch)

async function _fetch(useToast)
{
  try
  {
    state.loading = true
    state.tokens = await getIndex()
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, '_fetch()' ],
      message: '토큰을 가져오지 못했습니다.',
      error: e,
      useToast,
    })
  }
  finally
  {
    state.loading = false
  }
}

function copyTokenToClipboard(token)
{
  try
  {
    copyToClipboard(token)
    toast.add('클립보드에 복사했습니다.', 'success').then()
  }
  catch (e)
  {
    toast.add('클립보드에 복사하지 못했습니다.', 'error').then()
  }
}

function controlPostToken(sw, data)
{
  state.postToken.data = data || null
  state.postToken.open = sw
}

async function onClickDeleteToken(srl, idx)
{
  if (!confirm('정말로 토큰을 삭제할까요?')) return
  await deleteToken(srl)
  state.tokens.splice(idx, 1)
  toast.add('토큰을 삭제했습니다.', 'success').then()
}

function onSubmitPostToken(mode)
{
  const message = mode === 'edit' ? '토큰을 수정했습니다.' : '새로운 토큰을 만들었습니다.'
  toast.add(message, 'success').then()
  controlPostToken(false)
  _fetch(true).then()
}
</script>

<style src="./token.scss" lang="scss" scoped></style>
