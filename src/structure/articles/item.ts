import { marked } from 'marked'
import { get } from '../../libs/api'
import { getDate } from '../../libs/date'

async function requestArticle(srl: number, root: boolean): Promise<any>
{
  const { success, message, data }: any = await get(`/articles/${srl}/`, {
    ext_field: `category_name${root ? ',nest_name' : ''}`,
  })
  if (!success) throw new Error(message)
  return {
    srl: data.srl,
    nestSrl: data.nest_srl,
    title: data.title,
    type: data.type,
    content: marked(data.content),
    categoryName: data.category_name,
    nestName: data.nest_name,
    hit: data.hit,
    star: data.star,
    json: data.json,
    regdate: getDate(data.regdate),
    order: data.order,
  }
}

async function requestNest(srl: number): Promise<any>
{
  let res = await get(`/nests/${srl}/`)
  if (!res.success) throw new Error(res.message)
  return res.data
}

async function requestFiles(articleSrl: number): Promise<[]>
{
  const { success, message, data }: any = await get('/files/', {
    module: 'articles',
    target: articleSrl,
    unlimit: 1,
  })
  if (!success) throw new Error(message)
  return data.index.map((item: any) => {
    return {
      ...item,
    }
  })
}

export default async function getData(srl: number, root: boolean): Promise<any>
{
  let article = await requestArticle(srl, root)
  let [ nest, files ] = await Promise.all([
    requestNest(article.nestSrl),
    requestFiles(article.srl),
  ])
  return {
    article,
    nest,
    files,
  }
}
