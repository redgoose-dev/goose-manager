import { marked } from 'marked'
import { request, formData } from '../../libs/api.js'
import { baseRenderer } from '../../modules/marked.js'
import { getFilePath } from '../../libs/file.js'

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
  if (!src?.data) return null
  const _nest = nest?.index?.find(item => item.srl === src.data.nest_srl) || {}
  const _category = category?.index?.find(item => item.srl === src.data.category_srl) || {}
  return {
    srl: src.data.srl,
    nestSrl: src.data.nest_srl ? String(src.data.nest_srl) : null,
    categorySrl: src.data.category_srl ? String(src.data.category_srl) : '',
    title: src.data.title,
    description: getDescription(src.data.content),
    meta: [
      src.data.regdate,
      _nest.name && `둥지:${_nest.name}`,
      _category.name && `분류:${_category.name}`,
    ].filter(Boolean),
    image: getFilePath(src.data.json.thumbnail),
    private: src.data.mode === 'private',
  }
}
function filteringNest(src)
{
  if (!(src?.data?.index?.length > 0)) return []
  return src.data.index.map(o => {
    return {
      value: o.srl,
      label: `[${o.code}] ${o.name}`,
    }
  })
}
function filteringCategory(src)
{
  if (!(src?.data?.index?.length > 0)) return []
  let items = src.data.index.map(o => {
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
        params: { srl },
      },
      {
        key: 'nest',
        url: `/nest/`,
        params: {
          app_srl: '{{article.data.app_srl}}',
          unlimited: '1',
          mod: 'app',
        },
      },
      {
        key: 'category',
        url: '/category/',
        params: {
          module: 'nest',
          module_srl: '{{article.data.nest_srl}}',
          order: 'turn',
          sort: 'asc',
          unlimited: '1',
        },
      },
    ],
  })
  return {
    article: filteringArticle(res.article, res.nest?.data, res.category?.data),
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
      order: 'turn',
      sort: 'asc',
      unlimited: '1',
    },
  })
  return {
    category: filteringCategory(res),
  }
}

export async function submit(srl, nestSrl, categorySrl)
{
  await request(`/article/${srl}/`, {
    method: 'patch',
    body: formData({
      nest: nestSrl || null,
      category: categorySrl || 0,
    })
  })
}
