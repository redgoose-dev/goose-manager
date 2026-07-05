import { request } from '@/libs/api.js'
import { getDate } from '@/libs/date.js'
import { serialize } from '@/libs/strings.js'

function filteringJSON(src)
{
  return {
    total: src?.total || 0,
    index: src?.index?.map(o => {
      let title = o.name
      if (o.category?.name) title = `[${o.category.name}] ${o.name}`
      return {
        srl: o.srl,
        title,
        description: o.description,
        meta: [
          `번호: ${o.srl}`,
          o.category ? `분류: ${o.category.name}` : '',
          `날짜: ${getDate(o.created_at)}`,
        ],
      }
    })
  }
}
function filteringCategory(src)
{
  if (!(src?.index?.length > 0)) return []
  return src.index.map(o => {
    let category
    switch (o.name)
    {
      case 'none':
        category = '0'
        break
      case 'all':
        category = undefined
        break
      default:
        category = String(o.srl)
        break
    }
    const link = `./${serialize({ category }, true) || ''}`
    return {
      srl: category,
      link,
      label: o.name,
      count: o.count,
    }
  })
}
function filteringTag(src)
{
  if (!(src?.index?.length > 0)) return []
  return src.index.map(o => {
    return {
      srl: o.srl,
      name: o.name,
    }
  })
}

export async function getData(query = {}, options = {})
{
  const { size, useTag } = options
  const category_srl = query.category === undefined ? undefined : (Number(query.category) || 0)
  const { json, category, tag } = await request('/mix/', {
    method: 'post',
    body: [
      {
        key: 'json',
        url: '/json/',
        params: {
          field: 'srl,name,description,category_srl,created_at',
          category: category_srl,
          page: query.page > 1 ? query.page : undefined,
          size: size,
          order: `${query.order || 'srl'} ${query.sort || 'DESC'}`,
          tag: query.tag,
          mod: query.category === undefined ? 'category' : undefined,
        },
      },
      {
        key: 'category',
        url: '/category/',
        params: {
          module: 'json',
          order: 'turn ASC',
          page: 0,
          tag: query.tag,
          mod: 'count,none,all',
        },
      },
      useTag && {
        key: 'tag',
        url: '/tag/',
        params: {
          module: 'json',
          page: 0,
        },
      },
    ].filter(Boolean),
  })
  return {
    json: filteringJSON(json),
    category: filteringCategory(category),
    tag: filteringTag(tag),
  }
}
