import { get, post, formData } from '../../libs/api'

async function requestNest(nestSrl: number): Promise<any>
{
  let res = await get(`/nests/${nestSrl}/`)
  return res.success ? res.data : null
}

async function requestCategories(nestSrl: number): Promise<any>
{
  let res = await get(`/categories/`, {
    module: 'article',
    target: nestSrl,
    field: 'srl,name,turn',
    order: 'turn',
    sort: 'asc',
    strict: 1,
  })
  return res.data?.index?.length > 0 ? res.data?.index.map((o: any) => {
    return {
      label: o.name,
      value: o.srl,
    }
  }) : []
}

async function requestArticle(articleSrl: number): Promise<any>
{
  let res = await get(`/articles/${articleSrl}/`, {
    ext_field: 'category_name',
    visible_type: 'all',
  })
  if (!res.success) throw new Error(res.message)
  return res.data
}
async function requestReadyArticle(nest: any): Promise<any>
{
  let article
  let res = await get('/articles/', {
    visible_type: 'ready',
  })
  if (res.data?.index?.length > 0)
  {
    article = res.data?.index[0]
    if (nest.srl !== article.nest_srl)
    {
      article.category_srl = null
    }
  }
  else
  {
    let json = {}
    res = await post('/articles/', formData({
      app_srl: Number(nest.app_srl),
      nest_srl: Number(nest.srl),
      type: 'ready',
      json: JSON.stringify(json),
    }))
    if (res.success)
    {
      res = await get(`/articles/`, {
        visible_type: 'ready',
      })
      if (!(res.data?.index?.length > 0)) throw new Error('no ready item')
      article = res.data?.index[0]
    }
    else
    {
      throw new Error(res.message)
    }
  }
  return article
}

export async function getData(nestSrl?: number, articleSrl?: number): Promise<any>
{
  let nest: any, categories: any, article: any
  if (nestSrl)
  {
    nest = await requestNest(nestSrl)
    ;[ categories, article ] = await Promise.all([
      requestCategories(nestSrl),
      !!articleSrl ? requestArticle(articleSrl) : requestReadyArticle(nest),
    ].filter(Boolean))
  }
  else
  {
    if (!articleSrl) throw new Error('no articleSrl')
    article = await requestArticle(articleSrl)
    ;[ nest, categories ] = await Promise.all([
      requestNest(article.nest_srl),
      requestCategories(article.nest_srl),
    ])
  }
  return {
    nest,
    categories,
    article,
  }
}

export async function deleteThumbnail(path: string): Promise<void>
{
  try
  {
    await post('/files/remove-file/', formData({ path }))
  }
  catch (_) {}
}

export async function uploadThumbnail(base64: string): Promise<string>
{
  let res = await post('/files/upload-file/', formData({
    sub_dir: 'thumbnail',
    base64,
  }))
  if (!res.success) throw new Error(res.message || 'Failed upload file.')
  if (!res.data?.path) throw new Error('Not found source path.')
  return res.data.path
}
