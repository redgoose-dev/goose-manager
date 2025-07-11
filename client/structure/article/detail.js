import { marked } from 'marked'
import { request, formData } from '../../libs/api.js'
import { defaultOptions, baseRenderer, renderContent } from '../../modules/marked.js'

function filteringArticle(src)
{
  if (!src?.data) return null
  const renderer = baseRenderer()
  let content = renderContent(src.data.content, src.data.mode === 'private')
  content = marked.parse(content, {
    ...defaultOptions,
    renderer,
  })
  return {
    srl: src.data.srl,
    nestSrl: src.data.nest_srl,
    title: src.data.title,
    content,
    mode: src.data.mode,
    hit: src.data.hit,
    star: src.data.star,
    json: src.data.json,
    regdate: src.data.regdate,
    createdAt: src.data.created_at,
    countFile: src.data.count_file || 0,
  }
}

function filteringNest(src)
{
  return src?.data || null
}

function filteringTag(src)
{
  return src?.data?.index?.length > 0 ? src.data.index : []
}

function filteringCategory(src)
{
  return src?.data || null
}

export async function getData(srl, withNest)
{
  if (!srl) return {}
  const res = await request('/mix/', {
    method: 'post',
    body: [
      {
        key: 'article',
        url: '/article/{srl}/',
        params: {
          srl,
          mod: 'count-file',
        },
      },
      {
        key: 'nest',
        url: '/nest/{srl}/',
        params: {
          srl: '{{article.data.nest_srl}}',
        },
      },
      {
        key: 'tag',
        url: '/tag/',
        params: {
          module: 'article',
          module_srl: '{{article.data.srl}}',
        },
      },
      withNest && {
        key: 'category',
        url: '/category/{srl}/',
        params: {
          srl: '{{article.data.category_srl}}',
        },
      },
    ].filter(Boolean),
  })
  return {
    nest: filteringNest(res.nest),
    article: filteringArticle(res.article),
    tag: filteringTag(res.tag),
    category: filteringCategory(res.category),
  }
}
