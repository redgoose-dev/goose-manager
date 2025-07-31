<template>
<article class="error">
  <div class="body">
    <figure>
      <Icon :name="_iconName"/>
    </figure>
    <code :class="[ `color--${_codeColor}` ]">
      {{props.code}}
    </code>
    <h1>{{pageTitle}}</h1>
    <p>{{pageMessage}}</p>
    <nav>
      <ButtonBasic
        type="button"
        icon-left="arrow-left"
        color="key"
        @click="router.back()">
        뒤로가기
      </ButtonBasic>
    </nav>
  </div>
</article>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { iconRandomPick } from '../../components/icon/map.js'
import Icon from '../../components/icon/index.vue'
import { ButtonBasic } from '../../components/button/index.js'

const props = defineProps({
  error: undefined,
  code: Number,
  pageTitle: String,
  pageMessage: String,
})
const router = useRouter()
const route = useRoute()

const _iconName = computed(() => {
  switch (props.code)
  {
    case 404:
      return 'bird'
    case 500:
      return 'bug'
    default:
      return iconRandomPick()
  }
})
const _codeColor = computed(() => {
  switch (props.code)
  {
    case 404:
      return 'code'
    case 500:
    default:
      return 'error'
  }
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
