<template>
<article>
  <PageHeader module="users"/>
  <Loading v-if="loading"/>
  <Items v-else-if="index?.length > 0" theme="list">
    <Card
      v-for="item in index"
      :title="item.title"
      :description="item.description"
      :meta="item.meta"
      :href="`./${item.srl}/`"
      :nav="[
        { label: '수정', href: `./${item.srl}/edit/` },
        !item.self && { label: '삭제', href: `./${item.srl}/delete/` },
        { label: '비밀번호 변경', href: `./${item.srl}/change-password/` },
      ].filter(Boolean)">
      <template v-if="item.self" #after>
        <Mark/>
      </template>
    </Card>
  </Items>
  <Empty v-else title="no item"/>
  <Controller v-if="auth.user.admin">
    <template #right>
      <ButtonBasic href="./create/" color="key" icon-left="plus">
        사용자 추가
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { authStore } from '../../store/auth'
import { getData } from '../../structure/users'
import { err } from '../../libs/error'
import PageHeader from '../../components/page/header/index.vue'
import { Items, Card, Mark } from '../../components/item'
import { Controller } from '../../components/navigation'
import { ButtonBasic } from '../../components/button'
import Loading from '../../components/etc/loading.vue'
import Empty from '../../components/error/empty.vue'

const auth = authStore()
const loading = ref(true)
const index = ref()
const total = ref(0)

onMounted(async () => {
  try
  {
    loading.value = true
    const res = await getData()
    total.value = res.total
    index.value = res.index
    loading.value = false
  }
  catch (e)
  {
    err(['/pages/users/index.vue', 'onMounted()'], 'error', e.message)
    loading.value = false
  }
});
</script>
