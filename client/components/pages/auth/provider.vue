<template>
<section :class="[ 'provider', _activate && 'is', _active && 'active' ]">
  <header class="header">
    <h1>
      <Icon
        :name="_activate ? 'power' : 'power-off'"
        :class="[ 'is', _activate && 'on' ]"/>
      <strong>{{_code}}</strong>
      <small v-if="_activate" :class="[ 'active', _active && 'on' ]">
        {{_active ? '활성' : '비활성'}}
      </small>
    </h1>
    <ButtonGroup>
      <ButtonBasic
        v-if="_useEditButton"
        size="small"
        icon-left="edit"
        :disabled="props.processing"
        @click="emits('update', { code: props.code, srl: props.srl })">
        정보수정
      </ButtonBasic>
      <ButtonBasic
        v-if="_activate && !_active"
        size="small"
        color="error"
        icon-left="unplug"
        :disabled="props.processing"
        @click="emits('disconnect', { code: props.code, srl: props.srl })">
        연결해제
      </ButtonBasic>
      <ButtonBasic
        v-if="!_activate"
        size="small"
        color="key"
        icon-left="plug"
        :disabled="props.processing"
        @click="emits('connect', props.code)">
        연결
      </ButtonBasic>
    </ButtonGroup>
  </header>
  <div v-if="_activate" class="body">
    <figure>
      <img v-if="props.avatar" :src="props.avatar" alt="">
      <i v-else>
        <Icon name="user"/>
      </i>
    </figure>
    <dl>
      <dt>User ID</dt>
      <dd>{{props.id}}</dd>
      <dt>Name</dt>
      <dd>{{props.name}}</dd>
      <dt>Email</dt>
      <dd>{{props.email}}</dd>
      <dt>Created at</dt>
      <dd>{{props.regdate}}</dd>
    </dl>
    <dl>
      <dt>Provider name</dt>
      <dd>{{props.code}}</dd>
      <template v-if="props.accessToken">
        <dt>Access token</dt>
        <dd>{{props.accessToken}}</dd>
      </template>
    </dl>
  </div>
</section>
</template>

<script setup>
import { computed } from 'vue'
import { authProviderLabel } from '../../../libs/assets.js'
import Icon from '../../icon/index.vue'
import { ButtonBasic, ButtonGroup } from '../../button/index.js'

const props = defineProps({
  srl: Number,
  code: String,
  id: String,
  name: String,
  email: String,
  avatar: String,
  regdate: String,
  accessToken: String,
  processing: Boolean,
})
const emits = defineEmits([ 'update', 'connect', 'disconnect' ])

const _activate = computed(() => (!!props.srl))
const _active = computed(() => (!!props.accessToken))
const _code = computed(() => (authProviderLabel[props.code] || ''))
const _useEditButton = computed(() => {
  if (!_activate.value) return false
  return ['password'].includes(props.code)
})
</script>

<style src="./provider.scss" lang="scss" scoped></style>
