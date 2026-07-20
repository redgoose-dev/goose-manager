<template>
<article class="error">
  <div class="body">
    <figure>
      <Icon :name="_iconName"/>
    </figure>
    <code :class="[ `color--${_codeColor}` ]">
      {{_code}}
    </code>
    <h1>{{pageTitle}}</h1>
    <p>{{pageMessage}}</p>
    <nav>
      <ButtonBasic
        v-if="_isControlBack"
        type="button"
        icon-left="arrow-left"
        color="key"
        @click="onClickBack">
        뒤로가기
      </ButtonBasic>
      <ButtonBasic
        v-if="_isControlRefresh"
        type="button"
        icon-left="refresh-cw"
        color="key"
        @click="onClickRefresh">
        새로고침
      </ButtonBasic>
    </nav>
  </div>
</article>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { iconRandomPick } from '@/components/icon/map.js'
import Icon from '@/components/icon/index.vue'
import { ButtonBasic } from '@/components/button/index.js'

const props = defineProps({
  error: undefined,
  code: Number,
  pageTitle: String,
  pageMessage: String,
  control: { type: String, default: '' }, // refresh,back
})
const router = useRouter()
const route = useRoute()

const _code = computed(() => (props.code || props.error?.status))
const _iconName = computed(() => {
  switch (_code.value)
  {
    case 404:
      return 'bird'
    case 500:
      return 'bug'
    case 503:
      return 'server-crash'
    default:
      return iconRandomPick()
  }
})
const _codeColor = computed(() => {
  switch (_code.value)
  {
    case 404:
      return 'code'
    case 500:
    default:
      return 'error'
  }
})
const _isControlBack = computed(() => (props.control === 'back'))
const _isControlRefresh = computed(() => (props.control === 'refresh'))

function onClickBack()
{
  router.back()
}

function onClickRefresh()
{
  location.reload()
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
