import { marked } from 'marked'
import { authStore } from '../../store/auth'
import { createFullPath } from '../files/util'
import { get, post, formData } from '../../libs/api'
import { baseRenderer } from '../../modules/marked'

function getDescription(content: string): string
{
  const renderer = baseRenderer()
  content = marked.parse(content, { renderer })
  content = content.replace(/(<([^>]+)>)/ig, '')
  content = content.replace(/\n/ig, '')
  content = content.substring(0, 75)
  return content
}

async function requestArticle(srl: number): Promise<any>
{
  const { success, message, data } = await get(`/articles/${srl}/`, {
    field: 'srl,app_srl,nest_srl,category_srl,title,content,json,regdate',
    ext_field: 'category_name,nest_name',
    visible_type: 'all',
  })
  if (!success) throw new Error(message)
  return {
    appSrl: data?.app_srl,
    nestSrl: data?.nest_srl,
    categorySrl: data?.category_srl,
    title: data?.title,
    description: getDescription(data?.content),
    image: createFullPath(data?.json.thumbnail?.path),
    meta: [
      data?.nest_name,
      data?.category_name,
      data?.regdate,
    ].filter(Boolean),
  }
}

async function requestNests(appSrl: number): Promise<any>
{
  const auth = authStore()
  let params: any = {
    app: appSrl,
    field: 'srl,app_srl,user_srl,id,name,json',
    ext_field: 'app_name',
    unlimit: 1,
  }
  if (!auth.user?.admin) params.user = auth.user?.srl
  const res = await get('/nests/', params)
  if (!res.success) throw new Error(res.message)
  return res.data?.index.map((o: any) => ({
    value: Number(o.srl),
    label: `[${o.id}] ${o.name}`,
  }))
}

export async function requestCategories(srl: string): Promise<any>
{
  let params = {
    module: 'article',
    target: srl,
    field: 'srl,name,turn',
    order: 'turn',
    sort: 'asc',
    unlimit: 1,
  }
  const res = await get('/categories/', params)
  return res.data?.index.map((item: any) => ({
    value: String(item.srl),
    label: item.name,
  }))
}

export async function getData(srl: number): Promise<any>
{
  const article = await requestArticle(srl)
  const nests = await requestNests(article.appSrl)
  return {
    article,
    nests,
  }
}

export async function submit({ srl, nestSrl, categorySrl }: any): Promise<void>
{
  let res = await post(`/articles/${srl}/change-nest/`, formData({
    nest_srl: nestSrl,
    category_srl: categorySrl,
  }))
  if (!res.success) throw new Error(res.message)
}
