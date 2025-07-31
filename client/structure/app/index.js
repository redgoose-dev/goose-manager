import { request } from '../../libs/api.js'
import { getDate } from '../../libs/date.js'

const defaultOptions = {
  url: '/app/',
  query: {
    order: 'srl',
    sort: 'desc',
    unlimited: '1',
    mod: 'count-nest,count-article',
  },
}

function filtering(src)
{
  if (!(src?.index?.length > 0)) return { total: 0, index: [] }
  return {
    total: src.total,
    index: src.index.map(item => {
      return {
        srl: item.srl,
        title: item.name,
        description: item.description,
        meta: [
          `번호: ${item.srl}`,
          `코드: ${item.code}`,
          `날짜: ${getDate(item.created_at)}`,
        ],
        count: {
          article: item.count_article,
          nest: item.count_nest,
        },
      }
    })
  }
}

export async function getData(options)
{
  let op = { ...defaultOptions, ...options }
  if (options?.query)
  {
    op.query = { ...defaultOptions.query, ...options.query }
  }
  const res = await request(op.url, {
    query: op.query,
  })
  return filtering(res?.data)
}
