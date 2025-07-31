import { request } from '../../libs/api.js'
import { articleModeLabel } from '../../libs/assets.js'
import { getFilePath } from '../../libs/file.js'
import { dateFormat } from '../../libs/date.js'

const apiUrl = {
  article: '/article/',
  nest: '/nest/',
  app: '/app/',
  json: '/json/',
}
const apiParams = {
  article: {
    fields: 'srl,category_srl,title,hit,star,mode,json,regdate',
  },
  nest: {
    fields: 'srl,code,name,created_at,json',
    mod: 'count-article',
  },
  app: {
    fields: 'srl,code,name,created_at',
    mod: 'count-nest,count-article',
  },
  json: {
    fields: 'srl,name,created_at',
  },
}

function filteringArticle(src)
{
  if (!(src?.index?.length > 0)) return null
  return src.index.map(o => {
    return {
      srl: o.srl,
      title: o.title,
      href: `/article/${o.srl}/`,
      image: getFilePath(o.json?.thumbnail),
      private: o.mode === 'private',
      meta: [
        articleModeLabel[o.mode] || false,
        o.regdate,
        `조회수: ${o.hit}`,
        `좋아요: ${o.star}`,
      ].filter(Boolean),
    }
  })
}
function filteringNest(src)
{
  if (!(src?.index?.length > 0)) return null
  return src.index.map(o => {
    return {
      srl: o.srl,
      title: o.name,
      href: `/nest/${o.srl}/article/`,
      meta: [
        `번호: ${o.srl}`,
        `코드: ${o.code}`,
        dateFormat(new Date(o.created_at), '{yyyy}-{MM}-{dd}'),
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
  return src.index.map(o => {
    return {
      srl: o.srl,
      title: o.name,
      meta: [
        `번호: ${o.srl}`,
        `코드: ${o.code}`,
        dateFormat(new Date(o.created_at), '{yyyy}-{MM}-{dd}'),
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
  return src.index.map(o => {
    return {
      srl: o.srl,
      title: o.name,
      href: `/json/${o.srl}/`,
      meta: [
        `번호: ${o.srl}`,
        dateFormat(new Date(o.created_at), '{yyyy}-{MM}-{dd}'),
      ].filter(Boolean),
    }
  })
}

export async function getData(contents)
{
  if (!(contents.length > 0)) return null
  const body = contents.map(o => {
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
  const res = await request('/mix/', {
    method: 'post',
    body,
  })
  let result = {}
  Object.entries(res).forEach(([key, value]) => {
    switch (key)
    {
      case 'article':
        result[key] = filteringArticle(value.data)
        break
      case 'nest':
        result[key] = filteringNest(value.data)
        break
      case 'app':
        result[key] = filteringApp(value.data)
        break
      case 'json':
        result[key] = filteringJSON(value.data)
        break
    }
  })
  return result
}
