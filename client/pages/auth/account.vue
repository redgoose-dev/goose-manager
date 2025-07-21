<template>
<article>
  <PageHeader module="account"/>
  <Loading v-if="state.loading"/>
  <div v-else-if="state.providers.length > 0" class="providers">
    <Provider
      v-for="o in state.providers"
      :srl="o.srl"
      :code="o.code"
      :id="o.id"
      :name="o.name"
      :email="o.email"
      :avatar="o.avatar"
      :regdate="o.regdate"
      :access-token="auth._account.srl === o.srl ? auth.token : ''"
      :processing="state.processing"
      @update="onClickUpdateProvider"
      @connect="onClickConnectProvider"
      @disconnect="onClickDisconnectProvider"/>
  </div>
  <Empty v-else title="no data"/>
  <teleport to="#modals">
    <Modal
      :open="state.provider.open"
      :scroll="true"
      :shortcut="true"
      @close="state.provider.open = false">
      <ModalWindow :scroll="false" class="update-provider-window">
        <PostProvider
          :srl="state.provider.srl"
          @close="state.provider.open = false"
          @submit="onPostProvider"/>
      </ModalWindow>
    </Modal>
  </teleport>
</article>
</template>

<script setup>
import { reactive, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { getIndex, disconnect } from '../../structure/auth/account.js'
import { webSocketAuth } from '../../libs/api.js'
import PageHeader from '../../components/header/page.vue'
import { Loading, Empty } from '../../components/content/index.js'
import Provider from '../../components/pages/auth/provider.vue'
import { Modal, ModalWindow } from '../../components/modal/index.js'
import PostProvider from '../../components/pages/auth/post-provider.vue'

const route = useRoute()
const toast = inject('toast')
const auth = inject('auth')
const error = inject('error')
const errorPath = [ 'pages', 'auth', 'account.vue' ]
const state = reactive({
  loading: true,
  processing: false,
  providers: [],
  provider: {
    open: false,
    srl: NaN,
  },
})

onMounted(_fetch)

async function _fetch()
{
  try
  {
    state.loading = true
    state.providers = await getIndex({
      redirect_uri: auth.url,
    })
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '인증 데이터를 가져오지 못했습니다.',
      error: e,
      useToast: false,
    })
  }
  finally
  {
    state.loading = false
  }
}

function onClickUpdateProvider({ code, srl })
{
  state.provider.srl = srl
  state.provider.open = true
}
function onPostProvider(mode, data)
{
  state.provider.srl = NaN
  state.provider.open = false
  _fetch().then()
  switch (mode)
  {
    case 'create':
      toast.add('새로운 계정을 만들었습니다.', 'success').then()
      break
    case 'edit':
      // update store
      if (data.id) auth.provider.user_id = data.id
      auth.provider.user_avatar = data.avatar || ''
      auth.provider.user_name = data.name || ''
      auth.provider.user_email = data.email || ''
      // print message
      toast.add('계정을 업데이트 완료했습니다.', 'success').then()
      break
  }
}

function onClickConnectProvider(code)
{
  switch (code)
  {
    case 'password':
      state.provider.srl = NaN
      state.provider.open = true
      break
    case 'discord':
    case 'google':
    case 'github':
      // connect websocket
      const evt = webSocketAuth(code, {})
      evt.addEventListener('start', ({ detail }) => {
        if (detail.url) window.open(detail.url)
        else toast.add('인증 페이지를 열지 못했습니다.', 'error').then()
      })
      evt.addEventListener('error', ({ detail }) => {
        toast.add('인증오류가 발생했습니다.', 'error').then()
      })
      evt.addEventListener('complete', ({ detail }) => {
        _fetch().then()
        toast.add('새로운 계정을 만들었습니다.', 'success').then()
      })
      break
  }
}

async function onClickDisconnectProvider({ code, srl })
{
  if (!confirm('이 계정을 정말로 연결 해제하시겠습니까?')) return
  try
  {
    state.processing = true
    await disconnect(srl)
    const idx =state.providers.findIndex(o => (o.srl === srl))
    state.providers[idx] = { code }
    toast.add('연결을 해제했습니다.', 'success').then()
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onDisconnect()' ],
      message: '연결 해제하지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}
</script>

<style src="./account.scss" lang="scss" scoped></style>
