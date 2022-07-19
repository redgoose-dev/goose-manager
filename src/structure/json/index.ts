import { get } from '../../libs/api'
import { getDate } from '../../libs/date'

interface Options {
  url: string
  params?: {
    order?: string
    sort?: string
  }
}

interface Response {
  total: number
  index?: {
    srl?: number
    title?: string
    description?: string
    meta?: string[]
  }[]
}

const defaultOptions: Options = {
  url: '/json/',
  params: {
    order: 'srl',
    sort: 'desc',
  },
}

function filtering(res: any): Response
{
  return {
    total: res.total,
    index: res.index.map((item: any) => ({
      srl: item.srl,
      title: item.name,
      description: item.description,
      meta: [
        `srl: ${item.srl}`,
        `regdate: ${getDate(item.regdate)}`,
      ],
    })),
  }
}

export default async function getData(options?: any): Promise<Response>
{
  let op: Options = Object.assign({}, defaultOptions, options)
  if (options?.params)
  {
    op.params = Object.assign({}, defaultOptions.params, options.params)
  }
  const { data } = await get(op.url, op.params)
  return filtering(data)
}
