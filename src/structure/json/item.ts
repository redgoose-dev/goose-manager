import { useRoute, RouteLocationNormalized } from 'vue-router'
import { get } from '../../libs/api'

let route: RouteLocationNormalized

export async function requestJson(): Promise<any>
{
  const { category } = route.query
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
    regdate: res.data.regdate,
  }
}

export default async function getData(): Promise<any>
{
  if (!route) route = useRoute()
  const json = await requestJson()
  return {
    ...json,
  }
}
