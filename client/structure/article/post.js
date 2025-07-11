import { request, formData, checkForms } from '../../libs/api.js'

function filteringNest(src)
{
  if (!src?.data) return null
  return src.data
}
function filteringArticle(src)
{
  if (!src?.data) return null
  return {
    ...src.data,
    json: src.data.json || {},
  }
}
function filteringCategory(src)
{
  if (!(src.data?.index?.length > 0)) return []
  return src.data.index.map(o => {
    return {
      value: o.srl,
      label: o.name,
    }
  })
}
function filteringTag(src)
{
  return src?.data?.index?.length > 0 ? src.data.index.map(o => o.name).join(',') : ''
}

export async function getData(nestSrl, articleSrl)
{
  let article
  const res = await request('/mix/', {
    method: 'post',
    body: [
      articleSrl ? {
        key: 'article',
        url: `/article/{srl}/`,
        params: { srl: articleSrl },
      } : {
        key: 'article',
        url: '/article/',
        method: 'put',
      },
      {
        key: 'nest',
        url: '/nest/{srl}/',
        params: { srl: nestSrl || '{{article.data.nest_srl}}' },
      },
      {
        key: 'category',
        url: '/category/',
        params: {
          module: 'nest',
          module_srl: nestSrl,
          fields: 'srl,name',
          order: 'turn',
          sort: 'asc',
          unlimited: '1',
        },
      },
      articleSrl && {
        key: 'article_tag',
        url: '/tag/',
        params: {
          module: 'article',
          module_srl: articleSrl,
        },
      },
    ].filter(Boolean),
  })
  return {
    nest: filteringNest(res.nest),
    article: filteringArticle(article || res.article),
    category: filteringCategory(res.category),
    tag: filteringTag(res.article_tag),
  }
}

export async function submit(srl, forms)
{
  const body = {
    app: forms.app_srl || null,
    nest: forms.nest_srl || null,
    category: forms.category_srl || 0,
    title: forms.title?.trim() || null,
    content: forms.content || null,
    json: JSON.stringify(forms.json),
    mode: (!forms.mode || forms.mode === 'ready') ? 'public' : forms.mode,
    regdate: forms.regdate || null,
    tag: forms.tag || null,
  }
  await request(`/article/${srl}/`, {
    method: 'patch',
    body: formData(body),
  })
}
