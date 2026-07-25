<template>
<article class="container-over">
  <PageHeader module="log"/>
  <IndexWithFilter>
    <template #content>
      <div class="content">
        <Loading v-if="state.loading"/>
        <div v-else-if="state.logs?.index?.length > 0">
          .log-items
        </div>
        <Empty v-else title="No data"/>
        <Controller v-if="true">
          <template #center>
            <ButtonBasic color="key" icon-left="plus">
              더보기
            </ButtonBasic>
          </template>
        </Controller>
      </div>
    </template>
    <template #filter>
      <Filter/>
    </template>
  </IndexWithFilter>
</article>
</template>

<script setup>
import { reactive, computed, onMounted, watch, inject } from 'vue'
import {  } from '@/structure/log/index.js'
import PageHeader from '@/components/header/page.vue'
import { Loading, Empty, IndexWithFilter } from '@/components/content/index.js'
import { Controller } from '@/components/navigation/index.js'
import { ButtonBasic } from '@/components/button/index.js'
import Filter from './_comp/filter.vue'

const error = inject('error')
const errorPath = [ 'pages', 'log', 'index.vue' ]
const state = reactive({
  loading: true,
  logs: null,
})

onMounted(async () => {
  try
  {
    //
  }
  catch (_e)
  {
    //
  }
  finally
  {
    state.loading = false
  }
})

async function _fetchContent()
{
  try
  {
    state.loading = true
  }
  catch (_e)
  {
    //
  }
  finally
  {
    state.loading = false
  }
}

function onUpdateFilter(value)
{
  //
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
