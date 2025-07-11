import { request } from '../../libs/api.js'
import { getDate } from '../../libs/date.js'
import { serialize } from '../../libs/strings.js'

function filteringJSON(src)
{
  if (!src?.data)
  {
    return { total: 0, index: [] }
  }
  return {
    total: src.data.total,
    index: src.data.index.map(o => {
      return {
        srl: o.srl,
        title: o.name,
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
function filteringCategory(src, query)
{
  if (!(src?.data?.index?.length > 0)) return []
  return src.data.index.map(o => {
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
  if (!(src?.data?.index?.length > 0)) return []
  return src.data.index.map(o => {
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
          fields: 'srl,name,description,category_srl,created_at',
          category_srl,
          page: query.page > 1 ? query.page : undefined,
          size: size || 24,
          order: query.order,
          sort: query.sort,
          tag: query.tag,
          mod: query.category === undefined ? undefined : 'category',
        },
      },
      {
        key: 'category',
        url: '/category/',
        params: {
          module: 'json',
          unlimited: '1',
          order: 'turn',
          sort: 'asc',
          tag: query.tag,
          mod: 'count,none,all',
        },
      },
      useTag && {
        key: 'tag',
        url: '/tag/',
        params: {
          module: 'json',
        },
      },
    ].filter(Boolean),
  })
  return {
    json: filteringJSON(json),
    category: filteringCategory(category, query),
    tag: filteringTag(tag),
  }
}
