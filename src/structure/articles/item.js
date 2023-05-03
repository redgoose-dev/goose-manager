import { marked } from 'marked'
import { get } from '../../libs/api'
import { getDate } from '../../libs/date'
import { baseRenderer } from '../../modules/marked'

async function requestArticle(srl, root)
{
  const { success, message, data } = await get(`/articles/${srl}/`, {
    ext_field: `category_name${root ? ',nest_name' : ''}`,
  })
  if (!success) throw new Error(message)
  const renderer = baseRenderer()
  return {
    srl: data.srl,
    nestSrl: data.nest_srl,
    title: data.title,
    type: data.type,
    content: marked.parse(data.content, { renderer }),
    categoryName: data.category_name,
    nestName: data.nest_name,
    hit: data.hit,
    star: data.star,
    json: data.json,
    regdate: getDate(data.regdate),
    order: data.order,
  }
}

async function requestNest(srl)
{
  let res = await get(`/nests/${srl}/`)
  if (!res.success) throw new Error(res.message)
  return res.data
}

async function requestFiles(articleSrl)
{
  const { success, message, data } = await get('/files/', {
    module: 'articles',
    target: articleSrl,
    unlimit: 1,
  })
  if (!success) throw new Error(message)
  return data.index.map((item) => {
    return {
      ...item,
    }
  })
}

export default async function getData(srl, root)
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
