import { request, formData } from '@/libs/api.js'

function filteringNest(src)
{
  return src ?? null
}
function filteringArticle(src)
{
  if (!src) return null
  return {
    ...src,
    json: src.json || {},
  }
}
function filteringCategory(src)
{
  if (!(src?.index?.length > 0)) return []
  return src.index.map(o => {
    return {
      value: o.srl,
      label: o.name,
    }
  })
}
function filteringTag(src)
{
  return src?.index?.length > 0 ? src.index.map(o => o.name).join(',') : ''
}

export async function getData(nestSrl, articleSrl)
{
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
        params: { srl: nestSrl || '{{article.nest_srl}}' },
      },
      {
        key: 'category',
        url: '/category/',
        params: {
          module: 'nest',
          module_srl: nestSrl,
          field: 'srl,name',
          page: 0,
          order: 'turn',
          sort: 'asc',
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
    article: filteringArticle(res.article),
    category: filteringCategory(res.category),
    tag: filteringTag(res.article_tag),
  }
}

export async function submit(srl, forms)
{
  const body = {
    app: forms.app_srl || undefined,
    nest: forms.nest_srl || undefined,
    category: forms.category_srl || 0,
    title: forms.title?.trim() || undefined,
    content: forms.content || undefined,
    json: JSON.stringify(forms.json),
    mode: (!forms.mode || forms.mode === 'ready') ? 'public' : forms.mode,
    regdate: forms.regdate || undefined,
    tag: forms.tag || undefined,
  }
  await request(`/article/${srl}/`, {
    method: 'patch',
    body,
  })
}
