import { marked } from 'marked'
import { request } from '@/libs/api.js'
import { defaultOptions, baseRenderer, renderContent } from '@/modules/marked.js'

function filteringArticle(src)
{
  if (!src) return null
  const renderer = baseRenderer()
  let content = renderContent(src.content, src.mode === 'private')
  content = marked.parse(content, {
    ...defaultOptions,
    renderer,
  })
  return {
    srl: src.srl,
    nestSrl: src.nest_srl,
    title: src.title,
    content,
    mode: src.mode,
    hit: src.hit,
    star: src.star,
    json: src.json,
    regdate: src.regdate,
    createdAt: src.created_at,
    countFile: src.count_file || 0,
  }
}

function filteringNest(src)
{
  return src.srl ? src : null
}

function filteringTag(src)
{
  return src?.index?.length > 0 ? src.index : []
}

function filteringCategory(src)
{
  return src?.srl ? src : null
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
          srl: '{{article.nest_srl}}',
        },
      },
      {
        key: 'tag',
        url: '/tag/',
        params: {
          module: 'article',
          module_srl: '{{article.srl}}',
        },
      },
      withNest && {
        key: 'category',
        url: '/category/{srl}/',
        params: {
          srl: '{{article.category_srl}}',
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
