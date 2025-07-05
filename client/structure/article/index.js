import { request } from '../../libs/api.js'
import { getDate } from '../../libs/date.js'
import { serialize } from '../../libs/strings.js'
import { preferenceStore } from '../../store/app.js'

function filteringArticle(src)
{
  if (!src?.data) return { total: 0, index: [] }
  const preference = preferenceStore()
  return {
    total: src.data.total,
    index: src.data.index.map(o => {
      let title = o.title
      if (o.nest?.code) title = `[${o.nest.code}] ${title}`
      else if (o.category?.name) title = `[${o.category.name}] ${title}`
      return {
        srl: o.srl,
        title,
        meta: [
          getDate(o[preference.article?.displayDateField] || o.created_at),
          `조회수:${o.hit || 0}`,
          `좋아요:${o.star || 0}`,
        ],
        thumbnail: 'https://goose.redgoose.me/data/upload/thumbnail/201905/5cecf0601d059.jpg', // TODO: 나중에 주소 생기면 추가하기
        private: o.mode === 'private',
      }
    })
  }
}
function filteringCategory(src)
{
  if (!(src?.data?.index?.length > 0)) return []
  return src.data.index.map(o => {
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
  if (!(src?.data?.index?.length > 0)) return []
  return src.data.index.map(o => {
    return {
      srl: o.srl,
      name: o.name,
    }
  })
}
function filteringNest(src)
{
  if (!src?.data) return null
  return src.data
}

export async function getData(query = {}, options = {})
{
  const { nestSrl, size, all } = options
  const nest_srl = nestSrl === undefined ? undefined : Number(nestSrl)
  const category_srl = query.category === undefined ? undefined : (Number(query.category) || 0)
  const fromNest = nest_srl !== undefined
  const { article, category, nest, tag } = await request('/mix/', {
    method: 'post',
    body: [
      {
        key: 'article',
        url: '/article/',
        params: {
          fields: 'srl,nest_srl,category_srl,title,hit,star,json,mode,regdate,created_at',
          nest_srl,
          category_srl,
          mode: query.mode,
          page: query.page > 1 ? query.page : undefined,
          size: size || 24,
          order: query.order,
          sort: query.sort,
          tag: query.tag,
          q: query.q,
          mod: fromNest ? (all ? 'category' : '') : 'nest',
        },
      },
      fromNest && {
        key: 'category',
        url: '/category/',
        params: {
          module: 'nest',
          module_srl: nest_srl,
          order: 'turn',
          sort: 'asc',
          tag: query.tag,
          q: query.q,
          unlimited: 1,
          mod: 'count,none,all',
        },
      },
      (all && fromNest) && {
        key: 'nest',
        url: `/nest/{srl}/`,
        params: {
          srl: nest_srl,
          fields: 'srl,code,description',
        },
      },
      all && {
        key: 'tag',
        url: '/tag/',
        params: { module: 'article' },
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
