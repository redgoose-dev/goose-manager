import { useRoute } from 'vue-router'
import { get } from '../../libs/api'
import { getDate } from '../../libs/date'
import { serialize } from '../../libs/string'

let route

export async function requestJson()
{
  const { category } = route.query
  const res = await get('/json/', {
    order: 'srl',
    sort: 'desc',
    category: category || undefined,
    ext_field: 'category_name',
  })
  if (!res.success) throw new Error(res.message)
  return {
    total: res.data.total,
    items: res.data.index.map(item => {
      return {
        srl: item.srl,
        title: item.name,
        description: item.description,
        meta: [
          `번호: ${item.srl}`,
          item.category_srl && `분류: ${item.category_name}`,
          `등록일: ${getDate(item.regdate)}`,
        ].filter(Boolean),
      }
    }),
  }
}

export async function requestCategories()
{
  const { category } = route.query
  let res = await get(`/categories/`, {
    module: 'json',
    order: 'turn',
    sort: 'asc',
    ext_field: 'count,all,none',
    unlimit: 1,
    strict: 1,
  })
  if (!res.success) throw new Error(res.message)
  let params = {
    ...route.query,
    category: undefined,
  }
  return res.data?.index.map(item => {
    let link
    let active
    switch (item.srl)
    {
      case '':
        link = serialize(params, true)
        active = !category
        break
      case 'null':
        params.category = 'null'
        link = serialize(params, true)
        active = category === 'null'
        break
      default:
        params.category = item.srl
        link = item.srl ? serialize(params, true) : ''
        active = Number(category) === item.srl
        break
    }
    return {
      link,
      label: item.name,
      count: item.count_json,
      active,
    }
  })
}

export async function getData()
{
  if (!route) route = useRoute()
  let [ json, categories ] = await Promise.all([
    requestJson(),
    requestCategories(),
  ])
  return {
    total: json.total,
    json: json.items,
    categories,
  }
}
