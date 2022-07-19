import { get } from '../../libs/api'
import { getDate } from '../../libs/date'

interface ResponseNest {
  srl: number
  id: string
  name: string
}

interface ResponseCategory {
  srl: string
  title: string
  meta: string[]
}

interface Response {
  nest: ResponseNest
  categories: ResponseCategory[]
}

async function requestNest(nestSrl: number): Promise<ResponseNest>
{
  let res = await get(`/nests/${nestSrl}/`, {
    field: 'srl,id,name',
  })
  if (!res.success) throw new Error(res.message)
  return {
    srl: res.data.srl,
    id: res.data.id,
    name: res.data.name,
  }
}

async function requestCategories(nestSrl: number): Promise<ResponseCategory[]>
{
  let res = await get('/categories/', {
    nest: nestSrl,
    order: 'turn',
    sort: 'asc',
  })
  if (!res.success) throw new Error(res.message)
  return res.data.index.map((item: any) => {
    return {
      srl: item.srl,
      title: item.name,
      meta: [
        getDate(item.regdate),
      ],
    }
  })
}

export default async function getData(srl: number): Promise<Response>
{
  if (!srl) throw new Error('no srl')
  const [ nest, categories ] = await Promise.all([
    requestNest(srl),
    requestCategories(srl),
  ])
  return { nest, categories }
}
