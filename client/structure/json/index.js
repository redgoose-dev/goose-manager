import { request } from '../../libs/api.js'
import { getDate } from '../../libs/date.js'
import { serialize } from '../../libs/strings.js'

function filteringJSON(src)
{
  if (!src.data)
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
  if (!(src.data?.index?.length > 0)) return []
  return src.data.index.map(o => {
    let _query = { ...query }
    let link, active
    switch (o.name)
    {
      case 'none':
        _query.category = '0'
        active = query.category === '0'
        break
      case 'all':
        _query.category = undefined
        active = !query.category
        break
      default:
        _query.category = o.srl
        active = Number(query.category) === o.srl
        break
    }
    link = `./${serialize(_query, true) || ''}`
    return {
      link,
      label: o.name,
      count: o.count,
      active,
    }
  })
}

export async function getData(query = {})
{
  const category_srl = query.category === undefined ? undefined : (Number(query.category) || 0)
  const { json, category } = await request('/mix/', {
    method: 'post',
    body: [
      {
        key: 'json',
        url: '/json/',
        params: {
          fields: 'srl,name,description,category_srl,created_at',
          category_srl,
          page: query.page > 1 || 1,
          mod: query.category === undefined ? '' : 'category',
        },
      },
      {
        key: 'category',
        url: '/category/',
        params: {
          module: 'json',
          unlimited: 1,
          order: 'turn',
          sort: 'asc',
          mod: 'count,none,all',
        },
      },
    ],
  })
  return {
    json: filteringJSON(json),
    category: filteringCategory(category, query),
  }
}
