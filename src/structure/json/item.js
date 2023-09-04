import { useRoute } from 'vue-router'
import { get } from '../../libs/api'

let route

export async function requestJson()
{
  // const { category } = route.query
  const { srl } = route.params
  const res = await get(`/json/${srl}/`, {
    ext_field: 'category_name',
  })
  if (!res.success) throw new Error(res.message)
  return {
    srl: Number(res.data.srl),
    name: res.data.name,
    description: res.data.description,
    categoryName: res.data.category_name,
    json: res.data.json,
    path: res.data.path,
    regdate: res.data.regdate,
  }
}

export default async function getData()
{
  if (!route) route = useRoute()
  const json = await requestJson()
  return {
    ...json,
  }
}
