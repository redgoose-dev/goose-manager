import { dateStore } from '@/store/app.js'
import { request } from '@/libs/api.js'
import { serialize } from '@/libs/strings.js'

function filteringArticle(src)
{
  if (!src) return { total: 0, index: [] }
  const date = new dateStore()
  return {
    total: src.total,
    index: src.index?.map(o => {
      let title = o.title
      if (o.nest?.code) title = `[${o.nest.code}] ${title}`
      else if (o.category?.name) title = `[${o.category.name}] ${title}`
      const thumbnail = o.json?.thumbnail ? `/file/${o.json?.thumbnail}/` : null
      return {
        srl: o.srl,
        nestSrl: o.nest_srl,
        title,
        meta: [
          date.format(o.created_at, 'date'),
          `조회수:${o.hit || 0}`,
          `좋아요:${o.star || 0}`,
        ],
        thumbnail,
        private: o.mode === 'private',
      }
    })
  }
}
function filteringCategory(src)
{
  if (!(src?.index?.length > 0)) return []
  return src.index.map(o => {
    let category
    switch (o.name)
    {
      case 'none':
        category = '0'
        break
      case 'all':
        category = undefined
        break
      default:
        category = String(o.srl)
        break
    }
    const link = `./${serialize({ category }, true) || ''}`
    return {
      srl: category,
      link,
      label: o.name,
      count: o.count,
    }
  })
}
function filteringTag(src)
{
  if (!(src?.index?.length > 0)) return []
  return src.index.map(o => {
    return {
      srl: o.srl,
      name: o.name,
    }
  })
}
function filteringNest(src)
{
  if (!src) return null
  return {
    srl: src.srl,
    code: src.code,
    description: src.description,
    useCategory: Number(src.json?.useCategory) === 1,
  }
}

export async function getData(query = {}, options = {})
{
  const { nestSrl, size, all } = options
  const nest_srl = nestSrl === undefined ? undefined : Number(nestSrl)
  const category_srl = query.category === undefined ? undefined : (Number(query.category) || 0)
  const fromNest = nest_srl !== undefined
  const _order = `${query.order || 'srl'} ${query.sort ? query.sort.toUpperCase() : 'DESC'}`
  const { article, category, nest, tag } = await request('/mix/', {
    method: 'post',
    body: [
      {
        key: 'article',
        url: '/article/',
        params: {
          field: 'srl,nest_srl,category_srl,title,hit,star,json,mode,regdate,created_at',
          nest: nest_srl,
          category: category_srl,
          mode: query.mode,
          page: query.page > 1 ? query.page : undefined,
          size: size || 24,
          order: _order,
          tag: query.tag,
          q: query.q,
          mod: fromNest ? (!query.category ? 'category' : '') : 'nest',
        },
      },
      fromNest && {
        key: 'category',
        url: '/category/',
        params: {
          module: 'nest',
          module_srl: nest_srl,
          page: 0,
          order: 'turn ASC',
          tag: query.tag,
          q: query.q,
          mod: 'count,none,all',
        },
      },
      (all && fromNest) && {
        key: 'nest',
        url: `/nest/{srl}/`,
        params: {
          srl: nest_srl,
          field: 'srl,code,description,json',
        },
      },
      all && {
        key: 'tag',
        url: '/tag/',
        params: {
          module: 'article',
        },
      },
    ].filter(Boolean),
  })
  return {
    article: filteringArticle(article),
    category: filteringCategory(category),
    nest: filteringNest(nest),
    tag: filteringTag(tag),
  }
}
