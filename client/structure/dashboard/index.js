import { dateStore } from '@/store/app.js'
import { request } from '@/libs/api.js'
import { articleModeLabel } from '@/libs/assets.js'
import { getFilePath } from '@/libs/file.js'

const apiUrl = {
  article: '/article/',
  nest: '/nest/',
  app: '/app/',
  json: '/json/',
  log: '/log/summary/',
}
const apiParams = {
  article: {
    field: 'srl,category_srl,title,hit,star,mode,json,created_at',
    order: 'srl DESC'
  },
  nest: {
    field: 'srl,code,name,json,created_at',
    order: 'srl DESC',
    mod: 'count-article',
  },
  app: {
    field: 'srl,code,name,created_at',
    order: 'srl DESC',
    mod: 'count-nest,count-article',
  },
  json: {
    field: 'srl,name,created_at',
    order: 'srl DESC',
  },
  log: {},
}

function filteringArticle(src)
{
  if (!(src?.index?.length > 0)) return null
  const date = dateStore()
  return src.index.map(o => {
    return {
      srl: o.srl,
      title: o.title,
      href: `/article/${o.srl}/`,
      image: getFilePath(o.json?.thumbnail),
      private: o.mode === 'private',
      meta: [
        articleModeLabel[o.mode] || false,
        date.format(o.created_at, 'date'),
        `조회수: ${o.hit}`,
        `좋아요: ${o.star}`,
      ].filter(Boolean),
    }
  })
}
function filteringNest(src)
{
  if (!(src?.index?.length > 0)) return null
  const date = dateStore()
  return src.index.map(o => {
    return {
      srl: o.srl,
      title: o.name,
      href: `/nest/${o.srl}/article/`,
      meta: [
        `번호: ${o.srl}`,
        `코드: ${o.code}`,
        date.format(o.created_at, 'date'),
      ].filter(Boolean),
      status: [
        { label: '아티클', value: o.count_article },
      ],
      useCategory: Number(o.json?.useCategory) === 1,
    }
  })
}
function filteringApp(src)
{
  if (!(src?.index?.length > 0)) return null
  const date = dateStore()
  return src.index.map(o => {
    return {
      srl: o.srl,
      title: o.name,
      meta: [
        `번호: ${o.srl}`,
        `코드: ${o.code}`,
        date.format(o.created_at, 'date'),
      ].filter(Boolean),
      status: [
        { label: '아티클', value: o.count_article },
      ],
    }
  })
}
function filteringJSON(src)
{
  if (!(src?.index?.length > 0)) return null
  const date = dateStore()
  return src.index.map(o => {
    return {
      srl: o.srl,
      title: o.name,
      href: `/json/${o.srl}/`,
      meta: [
        `번호: ${o.srl}`,
        date.format(o.created_at, 'date'),
      ].filter(Boolean),
    }
  })
}
function filteringLog(src)
{
  const data = src?.data ?? src
  if (!data) return null
  const date = dateStore()
  const from = date.format(data.assets?.from, 'date-time')
  const to = date.format(data.assets?.to, 'date-time')
  const fromTime = new Date(data.assets?.from).getTime()
  const toTime = new Date(data.assets?.to).getTime()
  const durationHours = Math.round((toTime - fromTime) / (60 * 60 * 1000))
  let rangeLabel = ''
  if (Number.isFinite(durationHours) && durationHours > 0)
  {
    rangeLabel = durationHours <= 48 ?
      `최근 ${durationHours}시간` :
      `최근 ${Math.round(durationHours / 24)}일`
  }
  return {
    total: toNumber(data.total),
    error: toNumber(data.levels?.error),
    warning: toNumber(data.levels?.warning),
    averageDuration: formatDuration(data.duration_ms?.average),
    maxDuration: formatDuration(data.duration_ms?.max),
    latestErrorAt: date.format(data.latest_error_at, 'date-time'),
    rangeLabel,
    period: from && to ? `${from} ~ ${to}` : '',
    intervalLabel: data.assets?.interval === 'day' ? '1일 단위' : '1시간 단위',
  }
}

function toNumber(value)
{
  const result = Number(value)
  return Number.isFinite(result) ? result : 0
}

function formatDuration(value)
{
  if (value === null || value === undefined || value === '') return '-'
  const result = Number(value)
  if (!Number.isFinite(result)) return '-'
  return `${Math.round(result * 1000) / 1000} ms`
}

export async function getData(contents = [])
{
  const map = new Map()
  const order = []
  if (!(contents?.length > 0)) return { map, order }
  const requestBody = contents.map(o => {
    if (!apiUrl[o.module]) return false
    return {
      key: o.module,
      url: apiUrl[o.module],
      params: {
        ...apiParams[o.module],
        ...o.params,
      },
    }
  }).filter(Boolean)
  if (!(requestBody.length > 0)) return { map, order }
  const response = await request('/mix/', {
    method: 'post',
    body: requestBody,
  })
  contents.forEach(({ module: key }) => {
    const value = response[key]
    switch (key)
    {
      case 'article':
        map.set(key, filteringArticle(value))
        order.push((key))
        break
      case 'nest':
        map.set(key, filteringNest(value))
        order.push((key))
        break
      case 'app':
        map.set(key, filteringApp(value))
        order.push((key))
        break
      case 'json':
        map.set(key, filteringJSON(value))
        order.push((key))
        break
      case 'log':
        map.set(key, filteringLog(value))
        order.push((key))
        break
    }
  })
  return {
    map,
    order,
  }
}
