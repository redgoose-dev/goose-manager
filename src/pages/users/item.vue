<template>
<article>
  <PageHeader module="users" title="User"/>
  <Loading v-if="loading"/>
  <Fieldset v-else tag="section">
    <Field label="번호">
      {{item.srl}}
    </Field>
    <Field label="이메일 주소">
      <strong>{{item.email}}</strong>
    </Field>
    <Field label="이름">
      {{item.name}}
    </Field>
    <Field label="등록일">
      {{item.regdate}}
    </Field>
    <Field label="관리자">
      <FormSwitch :model-value="item.admin" :readonly="true"/>
    </Field>
  </Fieldset>
  <Controller>
    <template #left>
      <ButtonBasic href="../" icon-left="list">
        목록
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonGroup>
        <ButtonBasic href="./edit/" icon-left="edit">
          수정
        </ButtonBasic>
        <ButtonBasic href="./change-password/" icon-left="key">
          비밀번호 변경
        </ButtonBasic>
        <ButtonBasic v-if="!self" href="./delete/" color="key" icon-left="trash">
          삭제
        </ButtonBasic>
      </ButtonGroup>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { authStore } from '../../store/auth'
import getData from '../../structure/users/item'
import { err } from '../../libs/error'
import PageHeader from '../../components/page/header/index.vue'
import { Fieldset, Field } from '../../components/forms/fieldset'
import { FormSwitch } from '../../components/forms'
import { Controller } from '../../components/navigation'
import { ButtonBasic, ButtonGroup } from '../../components/button'
import Loading from '../../components/etc/loading.vue'

const route = useRoute()
const auth = authStore()
const loading = ref(true)
const item = ref()
const self = computed(() => (auth.user?.srl === Number(route.params.srl)))

onMounted(async () => {
  try
  {
    if (!route.params.srl) throw new Error('no srl')
    loading.value = true
    item.value = await getData({ url: `/users/${route.params.srl}/` })
    loading.value = false
  }
  catch (e)
  {
    err([ '/pages/users/item.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})
</script>
