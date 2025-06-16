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
    let _query = { ...query }
    let link, active
    switch (o.name)
    {
      case 'none':
        _query.category = '0'
        break
      case 'all':
        _query.category = undefined
        break
      default:
        _query.category = String(o.srl)
        break
    }
    _query.page = undefined
    link = `./${serialize(_query, true) || ''}`
    return {
      srl: _query.category,
      link,
      label: o.name,
      count: o.count,
    }
  })
}

function getCategorySrl(srl)
{
  return srl === undefined ? undefined : (Number(srl) || 0)
}

export async function getData(query = {}, options = {})
{
  const category_srl = getCategorySrl(query.category)
  const { json, category } = await request('/mix/', {
    method: 'post',
    body: [
      {
        key: 'json',
        url: '/json/',
        params: {
          fields: 'srl,name,description,category_srl,created_at',
          category_srl,
          page: query.page > 1 ? query.page : undefined,
          size: options.size || 24,
          mod: query.category === undefined ? undefined : 'category',
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

export async function getDataJSON(query = {}, options = {})
{
  const category = getCategorySrl(query.category)
  const res = await request('/json/', {
    query: {
      fields: 'srl,name,description,category_srl,created_at',
      category,
      page: query.page > 1 ? query.page : undefined,
      size: options.size || 24,
      mod: query.category === undefined ? undefined : 'category',
    },
  })
  return filteringJSON(res)
}
