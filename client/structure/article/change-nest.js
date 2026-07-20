import { marked } from 'marked'
import { request } from '@/libs/api.js'
import { baseRenderer } from '@/modules/marked.js'
import { getFilePath } from '@/libs/file.js'

function getDescription(content)
{
  const renderer = baseRenderer()
  content = marked.parse(content, { renderer })
  content = content.replace(/(<([^>]+)>)/ig, '')
  content = content.replace(/\n/ig, ' ')
  content = content.substring(0, 75)
  return content ? `${content.trim()}...` : ''
}

function filteringArticle(src, nest, category)
{
  if (!src) return null
  const _nest = nest?.index?.find(item => item.srl === src.nest_srl) || {}
  const _category = category?.index?.find(item => item.srl === src.category_srl) || {}
  return {
    srl: src.srl,
    nestSrl: src.nest_srl ? String(src.nest_srl) : null,
    categorySrl: src.category_srl ? String(src.category_srl) : '',
    title: src.title,
    description: getDescription(src.content),
    meta: [
      src.regdate,
      _nest.name && `둥지:${_nest.name}`,
      _category.name && `분류:${_category.name}`,
    ].filter(Boolean),
    image: getFilePath(src.json.thumbnail),
    private: src.mode === 'private',
  }
}
function filteringNest(src)
{
  if (!(src?.index?.length > 0)) return []
  return src.index.map(o => {
    return {
      value: o.srl,
      label: `[${o.code}] ${o.name}`,
    }
  })
}
function filteringCategory(src)
{
  if (!(src?.index?.length > 0)) return []
  let items = src.index.map(o => {
    return {
      value: String(o.srl),
      label: o.name,
    }
  })
  items.unshift({
    value: '0',
    label: '분류없음',
  })
  return items
}

export async function getData(srl)
{
  if (!srl) return {}
  const res = await request('/mix/', {
    method: 'post',
    body: [
      {
        key: 'article',
        url: `/article/{srl}/`,
        params: {
          srl,
          mod: 'app',
        },
      },
      {
        key: 'nest',
        url: `/nest/`,
        params: {
          app: `{{article.app.srl}}`,
          page: 0,
          mod: 'count-article',
        },
      },
      {
        key: 'category',
        url: '/category/',
        params: {
          module: 'nest',
          module_srl: '{{article.nest_srl}}',
          page: 0,
          order: 'turn ASC',
        },
      },
    ],
  })
  return {
    article: filteringArticle(res.article, res.nest, res.category),
    nest: filteringNest(res.nest),
    category: filteringCategory(res.category),
  }
}

export async function changeNest(srl)
{
  if (!srl) return {}
  const res = await request('/category/', {
    query: {
      module: 'nest',
      module_srl: srl,
      page: 0,
      order: 'turn ASC',
    },
  })
  return {
    category: filteringCategory(res.data),
  }
}

export async function submit(srl, nestSrl, categorySrl)
{
  await request(`/article/${srl}/`, {
    method: 'patch',
    body: {
      nest: nestSrl || null,
      category: categorySrl || 0,
    },
  })
}
