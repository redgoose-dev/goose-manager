<template>
<article class="container-over log">
  <PageHeader module="log">
    <ButtonBasic
      size="small"
      icon-left="refresh-cw"
      color="key"
      :rotate-icon="state.loading"
      :disabled="state.loading || state.loadingMore"
      @click="_fetchContent()">
      새로고침
    </ButtonBasic>
  </PageHeader>
  <IndexWithFilter>
    <template #content>
      <div class="content">
        <Loading v-if="state.loading"/>
        <div v-else class="result">
          <div v-if="state.logs?.index?.length > 0" class="logs">
            <div class="table-wrap">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col" class="timestamp">시각</th>
                    <th scope="col" class="level">레벨</th>
                    <th scope="col" class="message">메시지</th>
                    <th scope="col" class="status">상태</th>
                    <th scope="col" class="request">요청</th>
                    <th scope="col" class="duration">처리시간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in state.logs.index"
                    :key="item.id"
                    class="is-clickable"
                    tabindex="0"
                    role="button"
                    :aria-label="`로그 ${item.id} 상세 보기`"
                    @click="onClickLog(item)"
                    @keydown.enter.prevent="onClickLog(item)"
                    @keydown.space.prevent="onClickLog(item)">
                    <td class="timestamp" :title="item.timestamp">
                      {{formatTimestamp(item.timestamp)}}
                    </td>
                    <td class="level">
                      <Tag :label="item.level" :color="getLevelColor(item.level)"/>
                    </td>
                    <td :class="[ 'message', !hasMessage(item) && 'is-empty' ]">
                      <strong :title="getMessage(item)">
                        {{getMessage(item)}}
                      </strong>
                    </td>
                    <td :class="[ 'status', getStatusClass(item.status) ]">
                      {{item.status || '-'}}
                    </td>
                    <td class="request">
                      <p v-if="item.request">
                        <em v-if="item.request.method">{{item.request.method}}</em>
                        <code :title="item.request.path">{{item.request.path || '-'}}</code>
                      </p>
                      <small v-if="item.request?.id" :title="item.request.id">{{item.request.id}}</small>
                      <span v-if="!item.request">-</span>
                    </td>
                    <td class="duration">
                      {{formatDuration(item.duration_ms)}}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <Empty
            v-else
            title="No data"
            message="조건에 맞는 로그가 없습니다."
            icon="scroll-text"/>
          <Controller v-if="state.logs?.assets?.hasNext">
            <template #center>
              <ButtonBasic
                color="key"
                :icon-left="state.loadingMore ? 'loader' : 'plus'"
                :rotate-icon="state.loadingMore"
                :disabled="state.loadingMore"
                @click="onClickMore">
                {{state.loadingMore ? '불러오는 중' : '더 보기'}}
              </ButtonBasic>
            </template>
          </Controller>
        </div>
      </div>
    </template>
    <template #filter>
      <Filter
        :loading="state.loading || state.loadingMore"
        :total="state.logs?.total || 0"
        @update="onUpdateFilter"/>
    </template>
  </IndexWithFilter>
  <teleport to="#modals">
    <Modal
      :open="state.detail.open"
      mode="window"
      :shortcut="true"
      class="detail-modal"
      @close="state.detail.open = false">
      <ModalWindow tag="article" :scroll="false" class="detail-window">
        <ModalHeader
          title="로그 상세데이터"
          icon="scroll-text"
          @close="state.detail.open = false"/>
        <LogDetail
          :id="state.detail.id"
          @close="state.detail.open = false"/>
      </ModalWindow>
    </Modal>
  </teleport>
</article>
</template>

<script setup>
import { reactive, onMounted, watch, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dateStore } from '@/store/app.js'
import { serialize } from '@/libs/strings.js'
import { scrollTo } from '@/libs/util.js'
import { getData } from '@/structure/log/index.js'
import PageHeader from '@/components/header/page.vue'
import { Loading, Empty, IndexWithFilter } from '@/components/content/index.js'
import { Controller } from '@/components/navigation/index.js'
import { ButtonBasic } from '@/components/button/index.js'
import { Modal, ModalWindow, ModalHeader } from '@/components/modal/index.js'
import { Tag } from '@/components/item/index.js'
import Filter from './_comp/filter.vue'
import LogDetail from './_comp/detail.vue'

const route = useRoute()
const router = useRouter()
const error = inject('error')
const date = dateStore()
const errorPath = [ 'pages', 'log', 'index.vue' ]
const state = reactive({
  loading: true,
  loadingMore: false,
  logs: null,
  detail: {
    open: false,
    id: null,
  },
})
let fetchId = 0

onMounted(_fetchContent)
watch(() => route.query, () => _fetchContent(true))

async function _fetchContent(useScroll = false)
{
  const currentFetchId = ++fetchId
  try
  {
    if (useScroll) scrollTo()
    state.loadingMore = false
    state.loading = true
    const logs = await getData(route.query)
    if (currentFetchId !== fetchId) return
    state.logs = logs
  }
  catch (e)
  {
    if (currentFetchId !== fetchId) return
    state.logs = {
      index: [],
      assets: {
        hasNext: false,
        cursor: null,
      },
    }
    error.catch({
      path: [ ...errorPath, '_fetchContent()' ],
      message: '로그 데이터를 가져오지 못했습니다.',
      error: e,
      useToast: false,
    })
  }
  finally
  {
    if (currentFetchId === fetchId) state.loading = false
  }
}

async function onClickMore()
{
  if (state.loadingMore || !state.logs?.assets?.hasNext || !state.logs.assets.cursor) return
  const currentFetchId = fetchId
  try
  {
    state.loadingMore = true
    const logs = await getData(route.query, {
      cursor: state.logs.assets.cursor,
      total: false,
    })
    if (currentFetchId !== fetchId) return
    const index = new Map(state.logs.index.map(item => [ item.id, item ]))
    logs.index.forEach(item => index.set(item.id, item))
    state.logs = {
      index: Array.from(index.values()),
      total: state.logs.total,
      assets: logs.assets,
    }
  }
  catch (e)
  {
    if (currentFetchId !== fetchId) return
    error.catch({
      path: [ ...errorPath, 'onClickMore()' ],
      message: '다음 로그를 가져오지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    if (currentFetchId === fetchId) state.loadingMore = false
  }
}

function onUpdateFilter(query)
{
  const current = getRouteQuery(route.query)
  if (JSON.stringify(current) === JSON.stringify(query))
  {
    _fetchContent(true)
    return
  }
  router.push(`/log/${serialize(query, true)}`).then()
}

function onClickLog(item)
{
  const id = Number(item?.id)
  if (!Number.isSafeInteger(id) || id < 1) return
  state.detail.id = id
  state.detail.open = true
}

function getRouteQuery(query)
{
  const result = {}
  const keys = [
    'from',
    'to',
    'level',
    'status',
    'method',
    'path',
    'request_id',
    'q',
  ]
  keys.forEach(key => {
    const value = Array.isArray(query[key]) ? query[key][0] : query[key]
    result[key] = value || null
  })
  return result
}

function formatTimestamp(value)
{
  return date.format(value, 'date-time') || value || '-'
}

function formatDuration(value)
{
  if (value === null || value === undefined || value === '') return '-'
  const duration = Number(value)
  if (!Number.isFinite(duration)) return '-'
  if (duration >= 1000) return `${(duration / 1000).toFixed(duration >= 10000 ? 1 : 2)} s`
  return `${Math.round(duration * 100) / 100} ms`
}

function getMessage(item)
{
  return item.message || item.error?.message || '메시지 없음'
}

function hasMessage(item)
{
  return Boolean(item.message || item.error?.message)
}

function getLevelColor(level)
{
  switch (level)
  {
    case 'ERROR': return 'error'
    case 'WARNING': return 'base'
    case 'DEBUG': return 'code'
    case 'INFO':
    default:
      return 'blur'
  }
}

function getStatusClass(status)
{
  const value = Number(status)
  if (value >= 500) return 'status--error'
  if (value >= 400) return 'status--warning'
  if (value >= 200 && value < 400) return 'status--success'
  return ''
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
