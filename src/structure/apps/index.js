import { get } from '../../libs/api'
import { getDate } from '../../libs/date'

const defaultOptions = {
  url: '/apps/',
  params: {
    order: 'srl',
    sort: 'desc',
  },
}

async function request(op)
{
  return await get(op.url, op.params)
}

function filtering(res)
{
  return {
    total: res.total,
    index: res.index.map((item) => ({
      srl: item.srl,
      title: item.name,
      description: item.description,
      meta: [
        `번호:${item.srl}`,
        `아이디:${item.id}`,
        `날짜:${getDate(item.regdate)}`,
      ],
    })),
  }
}

export default async function getData(options)
{
  let op = Object.assign({}, defaultOptions, options)
  if (options?.params)
  {
    op.params = Object.assign({}, defaultOptions.params, options.params)
  }
  const { data } = await request(op)
  return filtering(data)
}
