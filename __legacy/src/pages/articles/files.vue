<template>
<article>
  <PageHeader module="articles" title="Article / Files"/>
  <div class="content-over">
    <Loading v-if="loading" class="loading"/>
    <Files
      v-else-if="index?.length > 0"
      :items="index"/>
    <Empty v-else title="파일이 없습니다."/>
  </div>
  <Controller>
    <template #left>
      <ButtonBasic type="button" icon-left="droplet" href="../">
        아티클
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import getData from '../../structure/files/items'
import { err } from '../../libs/error'
import PageHeader from '../../components/page/header/index.vue'
import Files from '../../components/pages/files/index.vue'
import { Controller } from '../../components/navigation'
import { ButtonBasic } from '../../components/button'
import Loading from '../../components/etc/loading.vue'
import Empty from '../../components/error/empty.vue'

const route = useRoute()
const index = ref([])
const total = ref(0)
const loading = ref(true)

onMounted(async () => {
  try
  {
    const srl = Number(route.params.articleSrl)
    let { files } = await getData(srl, 'articles')
    index.value = files.index
    total.value = files.total
    loading.value = false
  }
  catch (e)
  {
    err(['/pages/articles/files.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
})
</script>
