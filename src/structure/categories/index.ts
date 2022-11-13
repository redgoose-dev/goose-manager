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
  nest?: ResponseNest
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

async function requestCategoriesForArticles(nestSrl: number): Promise<ResponseCategory[]>
{
  let res = await get('/categories/', {
    module: 'article',
    target: nestSrl,
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

async function requestCategoriesForJson(): Promise<ResponseCategory[]>
{
  let res = await get('/categories/', {
    module: 'json',
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

export async function getDataForArticles(srl: number): Promise<Response>
{
  if (!srl) throw new Error('no srl')
  const [ nest, categories ] = await Promise.all([
    requestNest(srl),
    requestCategoriesForArticles(srl),
  ])
  return { nest, categories }
}

export async function getDataForJson()
{
  const categories = await requestCategoriesForJson()
  return {
    categories,
  }
}
